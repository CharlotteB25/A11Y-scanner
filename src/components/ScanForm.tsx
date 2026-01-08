"use client";

import { useMemo, useState } from "react";
import type { ScanResponse } from "@/lib/types";
import { FIX_GUIDES } from "@/lib/fixGuides";

const DEFAULT_URL = "https://example.com";

export default function ScanForm() {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScanResponse | null>(null);
  const [minImpact, setMinImpact] = useState<
    "all" | "moderate" | "serious" | "critical"
  >("all");
  const [query, setQuery] = useState("");

  const summary = useMemo(() => {
    if (!data) return null;
    return {
      total: data.violations.length,
      critical: data.violations.filter((v) => v.impact === "critical").length,
      serious: data.violations.filter((v) => v.impact === "serious").length,
    };
  }, [data]);

  const IMPACT_RANK: Record<string, number> = {
    minor: 1,
    moderate: 2,
    serious: 3,
    critical: 4,
  };

  function passesImpact(impact?: string) {
    if (minImpact === "all") return true;
    const rank = IMPACT_RANK[impact ?? "minor"] ?? 0;
    return rank >= IMPACT_RANK[minImpact];
  }

  const filteredViolations = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();

    return data.violations.filter((v) => {
      const matchesImpact = passesImpact(v.impact);
      const matchesQuery =
        !q ||
        v.id.toLowerCase().includes(q) ||
        v.help.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.tags.join(",").toLowerCase().includes(q);

      return matchesImpact && matchesQuery;
    });
  }, [data, query, minImpact]);

  async function runScan() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = (await res.json()) as ScanResponse;

      if (!res.ok || json.ok === false) {
        throw new Error(json.error ?? "Scan failed");
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="row">
        <input
          className="input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-site.com/page"
          aria-label="URL to scan"
        />
        <button
          className="button"
          onClick={runScan}
          disabled={loading || !url.trim()}
        >
          {loading ? "Scanning…" : "Run scan"}
        </button>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        <span className="badge">MVP: single page scan</span>
        <span className="badge">Output: axe violations</span>
      </div>

      {data && (
        <div className="card" style={{ marginTop: 14, padding: 12 }}>
          <div className="row">
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rule id, description, tags… (e.g. image-alt)"
              aria-label="Search violations"
            />

            <select
              className="select"
              value={minImpact}
              onChange={(e) => setMinImpact(e.target.value as any)}
              aria-label="Minimum severity"
            >
              <option value="all">All severities</option>
              <option value="moderate">Moderate+</option>
              <option value="serious">Serious+</option>
              <option value="critical">Critical only</option>
            </select>

            <button
              type="button"
              className="button"
              onClick={() => {
                setQuery("");
                setMinImpact("all");
              }}
            >
              Reset
            </button>
          </div>

          <div className="row" style={{ marginTop: 10 }}>
            <span className="badge">Showing: {filteredViolations.length}</span>
            <span className="badge">Total: {data.violations.length}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="item" style={{ marginTop: 14 }}>
          <h3 style={{ marginBottom: 4 }}>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {summary && (
        <div className="row" style={{ marginTop: 14 }}>
          <span className="badge">Total: {summary.total}</span>
          <span className="badge">Critical: {summary.critical}</span>
          <span className="badge">Serious: {summary.serious}</span>
        </div>
      )}

      {data && (
        <div className="list" aria-live="polite">
          {filteredViolations.map((v) => (
            <div
              key={v.id}
              className={`item ${v.impact ? `is-${v.impact}` : ""}`}
            >
              <h3>
                {v.id} • {v.impact ?? "unknown"} • {v.help}
              </h3>
              <p>{v.description}</p>

              <div className="kv">
                <div>WCAG tags</div>
                <div>{v.tags.join(", ") || "—"}</div>
                <div>Affected nodes</div>
                <div>{v.nodes.length}</div>
              </div>

              {FIX_GUIDES[v.id] && (
                <div className="guide" aria-label="Quick fix guidance">
                  <p className="guideTitle">Quick fix</p>

                  <div className="guideGrid">
                    <div className="guideBlock">
                      <h4>Why this matters</h4>
                      <p>{FIX_GUIDES[v.id].why}</p>
                    </div>

                    <div className="guideBlock">
                      <h4>How to fix</h4>
                      <ul>
                        {FIX_GUIDES[v.id].how.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    {FIX_GUIDES[v.id].example && (
                      <div className="guideBlock">
                        <h4>Example</h4>
                        <div className="codeSm">{FIX_GUIDES[v.id].example}</div>
                      </div>
                    )}

                    {v.helpUrl && (
                      <div className="guideBlock">
                        <h4>Reference</h4>
                        <p>
                          <a href={v.helpUrl} target="_blank" rel="noreferrer">
                            Axe rule documentation
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {v.nodes[0]?.html && (
                <div className="code" aria-label="Example failing HTML snippet">
                  {v.nodes[0].html}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
