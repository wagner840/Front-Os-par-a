"use client";

import OpportunityKeywordResults from "./opportunity-keyword-results";
import OpportunitySemanticResults from "./opportunity-semantic-results";

interface OpportunityResultsProps {
  showSemanticResults: boolean;
  semanticResults: any[] | null;
  setShowSemanticResults: (show: boolean) => void;
  selectedMainKeyword: string | null;
  keywordOpportunities: any[] | null;
}

export function OpportunityResults({
  showSemanticResults,
  semanticResults,
  setShowSemanticResults,
  selectedMainKeyword,
  keywordOpportunities,
}: OpportunityResultsProps) {
  return (
    <>
      {selectedMainKeyword && keywordOpportunities && (
        <OpportunityKeywordResults
          keywordOpportunities={keywordOpportunities}
        />
      )}

      {showSemanticResults && semanticResults && semanticResults.length > 0 && (
        <OpportunitySemanticResults
          semanticResults={semanticResults}
          setShowSemanticResults={setShowSemanticResults}
        />
      )}
    </>
  );
}
