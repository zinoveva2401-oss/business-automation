from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class CoreNormalizationContracts(unittest.TestCase):
    def test_release_identity_and_runtime_acceptance_are_explicit(self):
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        self.assertIn("PACKAGE VERSION: v2.0.11 RELEASE", skill)
        self.assertIn("PACKAGE RELEASE GATES = RUNTIME ACCEPTANCE VERIFIED; FINAL CORE QA PASS; LIVE BUSINESS SYSTEM WRITEBACK PENDING", skill)
        self.assertIn("PLATFORM INSTALL TELEMETRY = NOT VERIFIED", skill)

    def test_architect_is_conditional_and_has_no_tool_option(self):
        skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        gate = (ROOT / "references/architect-supervisor-gate.md").read_text(encoding="utf-8")
        self.assertIn("Conditional Runtime Architect / Execution Supervisor entry", skill)
        for phrase in ("NO ADDITIONAL TOOL REQUIRED", "dirty state", "two materially identical failed repair attempts", "actual final artifact", "PENDING WRITE-BACK"):
            self.assertIn(phrase, gate)

    def test_product_prototype_blocks_full_production_and_stays_format_neutral(self):
        product = (ROOT / "references/product-factory.md").read_text(encoding="utf-8").casefold()
        self.assertIn("p10.75", product)
        self.assertIn("before mass production", product)
        self.assertIn("real product content", product)
        self.assertIn("ask for approval of material product promise", product)
        self.assertIn("format-neutral", product)
        self.assertIn("temporary launch price", product)

    def test_future_client_boundary_is_conditional_and_isolated(self):
        client = (ROOT / "references/client-work-boundary.md").read_text(encoding="utf-8")
        for phrase in ("DOKRUTI_INTERNAL", "CLIENT_WORK", "does not create a Client Factory", "state", "brand", "data", "files", "access"):
            self.assertIn(phrase, client)

    def test_architecture_creation_is_blocked_without_reuse_and_core_proof(self):
        root = ROOT.parents[2]
        lint = (root / "scripts/spec-lint-v2.mjs").read_text(encoding="utf-8")
        for phrase in ("architecture.review_missing", "architecture.reuse_conflict", "architecture.owner_gate", "core.blob_drift", "source.conflict_wrong_winner"):
            self.assertIn(phrase, lint)
        agents = (root / "AGENTS.md").read_text(encoding="utf-8")
        self.assertIn("reuse the existing object", agents)
        self.assertNotIn("This run creates no Site, Content or Automation Codex projects", agents)

    def test_client_work_requires_separate_client_inputs_and_scopes(self):
        root = ROOT.parents[2]
        lint = (root / "scripts/spec-lint-v2.mjs").read_text(encoding="utf-8")
        for phrase in ("client.context_missing", "client.private_source_collision", "client.shared_core_drift", "DOKRUTI_UNPUBLISHED_MATERIAL"):
            self.assertIn(phrase, lint)
        client = (ROOT / "references/client-work-boundary.md").read_text(encoding="utf-8")
        for phrase in ("client_id", "order_id", "colors and fonts", "isolated authorized scope"):
            self.assertIn(phrase, client)

if __name__ == "__main__":
    unittest.main()
