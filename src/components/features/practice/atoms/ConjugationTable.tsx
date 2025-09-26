import React from "react";
import { TVerbConjugations } from "@/types/types";
import { ConjugationRow } from "./ConjugationRow";

interface ConjugationTableProps {
    verbConjugations: TVerbConjugations
}
/** TODO: Convert to i18n string */
const noConjugationText = "Your verb conjugations are all on point. Good job."
export const ConjugationTable = ({verbConjugations}: ConjugationTableProps) => {
    return (
        <section id="conjugations-section">
            <h3 className="font-semibold">Conjugations</h3>
            {verbConjugations.length < 1 && (
                <p>{noConjugationText}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verbConjugations.map((table, i) => (
                    <div key={i} className="border rounded p-2">
                        <h4 className="font-medium text-center mb-2">{table.verb}</h4>
                        <ul className="space-y-1">
                        {table.conjugation.map((form) => (
                            <ConjugationRow
                                pronoun={form.pronoun}
                                form={form.form}
                                isActive={form.correct_pronoun_for_sentence}
                                key={`${form.pronoun}_${form.form}`}
                            />
                        ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    )
};