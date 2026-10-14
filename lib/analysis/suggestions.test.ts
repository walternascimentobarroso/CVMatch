import { describe, expect, it } from "vitest";

import { keepSuggestionsFoundInCv } from "@/lib/analysis/suggestions";

const CV_TEXT = `Engenheira de software na Empresa Fictícia
Desenvolvi  APIs em Node.js
para a equipa de pagamentos.`;

function suggestion(original: string) {
  return { original, proposed: "versão proposta fictícia" };
}

describe("keepSuggestionsFoundInCv", () => {
  it("mantém a sugestão cujo trecho original existe no CV", () => {
    const kept = suggestion("Engenheira de software na Empresa Fictícia");
    expect(keepSuggestionsFoundInCv([kept], CV_TEXT)).toEqual([kept]);
  });

  it("descarta a sugestão cujo trecho original não existe no CV", () => {
    const kept = suggestion("para a equipa de pagamentos.");
    const discarded = suggestion("Liderei uma equipa de dez pessoas");
    expect(keepSuggestionsFoundInCv([discarded, kept], CV_TEXT)).toEqual([
      kept,
    ]);
  });

  it("ignora diferenças de espaços e quebras de linha", () => {
    const kept = suggestion(
      "  Desenvolvi APIs em Node.js para a\nequipa   de pagamentos. ",
    );
    expect(keepSuggestionsFoundInCv([kept], CV_TEXT)).toEqual([kept]);
  });

  it("descarta a sugestão com trecho original vazio", () => {
    expect(keepSuggestionsFoundInCv([suggestion("  \n")], CV_TEXT)).toEqual([]);
  });
});
