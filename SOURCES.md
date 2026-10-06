# Care profiles and score

This app is a playful guide for plants grown in pots. A common name can cover many species; the botanical label makes the intended scope explicit. Generic Orchid, Ficus, Peperomia and Hibiscus have been narrowed to moth orchid, weeping fig, baby rubber plant and tropical hibiscus. The 47 entries remain in their original order. Desert cacti exclude forest cacti.

Watering is expressed as growing-medium condition, never a fixed weekly frequency. Light uses the same three values in the form and data. Bright indirect light is a preferred profile, not a claim that shade-tolerant plants cannot live in lower light. Outdoor herbs may need outdoor growing conditions: a bright room is not equivalent to full sun. Pot size, medium, drainage, season and cultivar change care needs.

The score is an editorial match: 50 points for matching watering and 50 for matching light. It is not a biological measurement, a prediction, or a survival probability. Temperature is retained as context and saved with history, but is not scored. The former exact temperature targets were unsupported and have been removed. No numeric horticultural targets have been invented.

## References to verify before merging

- [NC State Extension Plant Toolbox](https://plants.ces.ncsu.edu/): each result links to its taxon page; legacy scientific names are used where the catalog uses them.
- [RHS: watering houseplants](https://www.rhs.org.uk/houseplants/watering): general medium-based watering and drainage guidance.
- [University of Minnesota Extension: growing indoor plants](https://extension.umn.edu/planting-and-growing-guides/growing-indoor-plants): light, watering, temperature and growing conditions.

**Verification pending:** during this task, all three reference hosts returned HTTP 403 from the environment's network proxy. The broad profiles and links are provisional and must be checked against the actual source pages before merge. They are not represented as newly verified research. Network domain additions were saved in the environment draft; saving does not apply them to this running instance.

## History and language

`plantsLanguage` stores `fr` or `en`; browser language is used only when there is no valid saved preference. New `plantHistory` records use stable plant IDs and `schemaVersion: 2`, with `kind: conditions-match`. Legacy survival-score entries remain untouched and are not reinterpreted. Storage failures do not block use. No history UI or tracking service is introduced.
