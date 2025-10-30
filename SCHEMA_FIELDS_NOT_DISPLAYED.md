This report lists schema fields not detected in any frontend GraphQL selection.

Filters applied:

- Exclude fields: \_Ignored, edges, pageInfo, pageTitle, and any starting with 'num'.
- Exclude types: any *Connection, *Edge, and PageInfo.

Heuristics:

- A field is considered used if it is selected in any `graphql` template (aliases, args,
  and bare selections are detected heuristically).
- Type context is ignored; common names like `id`/`name` may be overcounted as used.
- ‘Displayed’ is approximated by ‘queried somewhere in the UI’.

Summary:

Total object/interface types scanned: 250 Types with at least one unused field: 34

Types never referenced in fragments/queries, grouped by interface:

- Interface ArticleTag:
  - ArticleISSN
  - BHLWrongPageNumbers
  - Edition
  - FullIssue
  - GeneralDOI
  - GenusOnlyClassification
  - IgnoreLint
  - InPress
  - Incomplete
  - InitialsOnly
  - KnownAlternativeYear
  - MustUseChildren
  - NeedsTranslation
  - NonOriginal
  - PartLocation
  - PartialPage
  - RawPageRegex
  - UnavailableElectronic
- Interface BookTag:
  - BookEdition
  - Language
  - OriginalLanguage
- Interface CitationGroupTag:
  - ArticleNumberRegex
  - BHLYearRange
  - IgnoreLintCitationGroup
  - IgnorePotentialCitations
  - IssueRegex
  - MustHave
  - MustHaveAfter
  - MustHavePreciseDate
  - MustHaveSeries
  - MustHaveURL
  - OnlineRepository
  - PageRegex
  - SeriesRegex
  - SkipExtraBHLBibliographies
  - URLPattern
  - VolumeRegex
- Interface ClassificationEntryTag:
  - IgnoreLintClassificationEntry
  - Informal
  - StructuredData
- Interface CollectionTag:
  - ChildRule
  - CollectionCode
  - ConditionalMustHaveSpecimenLinks
  - MustHaveSpecimenLinks
  - MustUseChildrenCollection
  - MustUseTriplets
  - SpecimenLinkPrefix
  - SpecimenRegex
- Interface Model:
  - Book
  - IgnoredDoi
  - IssueDate
  - Specimen
  - SpecimenComment
- Interface NameTag:
  - HMW
  - IgnorePreoccupationBy
  - MappedClassificationEntry
  - NeedsPrioritySelection
  - PendingRejection
- Interface Node:
  - Book
  - IgnoredDoi
  - IssueDate
  - Specimen
  - SpecimenComment
- Interface PersonTag:
  - OnlineBio
  - TransliteratedFamilyName
- Interface SpecimenTag:
  - Box
  - FindKind
  - TaxonCount
- Interface TaxonTag:
  - Basal
  - EnglishCommonName
  - IgnoreLintTaxon
  - IncertaeSedis
  - KeyReference
- Interface TypeTag:
  - DifferentAuthority
  - IgnoreLintName
  - IgnorePotentialCitationFrom
  - ImpreciseLocality
  - IncorrectGrammar
  - InterpretedTypeLocality
  - InterpretedTypeSpecimen
  - InterpretedTypeTaxon
  - NoAge
  - NoCollector
  - NoDate
  - NoEtymology
  - NoGender
  - NoLocation
  - NoOrgan
  - NoOriginalParent
  - NoSpecimen
  - NomenclatureComments
  - OriginalTypification
  - PartialTaxon
  - RejectedLSIDName
  - TreatAsEquivalentTo
  - TypeLocality
  - VerbatimName
  - \_RawCollector
- Without interface:
  - HomonymData
  - MutationRoot
  - OpenArticle
  - PossibleHomonym
  - SearchResult

Unused fields grouped by interface:

## Interface: ArticleTag

### LSIDArticle

- LSIDArticle.presentInArticle

### RawPageRegex

- RawPageRegex.regex

## Interface: CitationGroupTag

### PageRegex

- PageRegex.allowStandard
- PageRegex.pagesRegex
- PageRegex.startPageRegex

## Interface: CollectionTag

### ChildRule

- ChildRule.regex

### CollectionCode

- CollectionCode.specimenRegex

### ConditionalMustHaveSpecimenLinks

- ConditionalMustHaveSpecimenLinks.regex

### SpecimenLinkPrefix

- SpecimenLinkPrefix.prefix

### SpecimenRegex

- SpecimenRegex.regex

## Interface: Model

### Article

- Article.Location
- Article.addday
- Article.addmonth
- Article.addyear
- Article.bools
- Article.ids
- Article.miscData

### Book

- Book.category
- Book.data
- Book.dewey
- Book.isbn
- Book.loc
- Book.subtitle

### CitationGroup

- CitationGroup.archive

### ClassificationEntry

- ClassificationEntry.rawData

### Collection

- Collection.removed

### IgnoredDoi

- IgnoredDoi.reason

### Location

- Location.ageDetail
- Location.deleted
- Location.locationDetail
- Location.specimenSet

### Name

- Name.data
- Name.fillDataLevel
- Name.originalParent

### NameComplex

- NameComplex.sourceLanguage

### Period

- Period.deleted

### Person

- Person.olId

### Region

- Region.specimenSet

### SpeciesNameEnding

- SpeciesNameEnding.fullNameOnly

### Specimen

- Specimen.description
- Specimen.link
- Specimen.locationText
- Specimen.taxonText

### StratigraphicUnit

- StratigraphicUnit.deleted

### Taxon

- Taxon.data
- Taxon.isPageRoot
- Taxon.specimenSet

## Interface: NameTag

### NeedsPrioritySelection

- NeedsPrioritySelection.reason

### PermanentlyReplacedSecondaryHomonymOf

- PermanentlyReplacedSecondaryHomonymOf.isInUse

### TakesPriorityOf

- TakesPriorityOf.isInPrevailingUsage

## Interface: Node

### Article

- Article.Location
- Article.addday
- Article.addmonth
- Article.addyear
- Article.bools
- Article.ids
- Article.miscData

### Book

- Book.category
- Book.data
- Book.dewey
- Book.isbn
- Book.loc
- Book.subtitle

### CitationGroup

- CitationGroup.archive

### ClassificationEntry

- ClassificationEntry.rawData

### Collection

- Collection.removed

### IgnoredDoi

- IgnoredDoi.reason

### Location

- Location.ageDetail
- Location.deleted
- Location.locationDetail
- Location.specimenSet

### Name

- Name.data
- Name.fillDataLevel
- Name.originalParent

### NameComplex

- NameComplex.sourceLanguage

### Period

- Period.deleted

### Person

- Person.olId

### Region

- Region.specimenSet

### SpeciesNameEnding

- SpeciesNameEnding.fullNameOnly

### Specimen

- Specimen.description
- Specimen.link
- Specimen.locationText
- Specimen.taxonText

### StratigraphicUnit

- StratigraphicUnit.deleted

### Taxon

- Taxon.data
- Taxon.isPageRoot
- Taxon.specimenSet

## Interface: SpecimenTag

### Box

- Box.description

## Interface: TypeTag

### AuthorityPageLink

- AuthorityPageLink.confirmed

### LectotypeDesignation

- LectotypeDesignation.isAssumptionOfMonotypy
- LectotypeDesignation.isExplicitChoice
- LectotypeDesignation.term

### LocationDetail

- LocationDetail.translation

### NomenclatureComments

- NomenclatureComments.record

### OriginalTypification

- OriginalTypification.basis

## Without Interface

### QueryRoot

- QueryRoot.articleByLabel
- QueryRoot.articleComment
- QueryRoot.book
- QueryRoot.bookByLabel
- QueryRoot.citationGroupByLabel
- QueryRoot.citationGroupPattern
- QueryRoot.citationGroupPatternByLabel
- QueryRoot.classificationEntryByLabel
- QueryRoot.collectionByLabel
- QueryRoot.ignoredDoi
- QueryRoot.ignoredDoiByLabel
- QueryRoot.issueDate
- QueryRoot.issueDateByLabel
- QueryRoot.locationByLabel
- QueryRoot.nameByLabel
- QueryRoot.nameComment
- QueryRoot.nameComplexByLabel
- QueryRoot.nameEnding
- QueryRoot.nameEndingByLabel
- QueryRoot.occurrence
- QueryRoot.periodByLabel
- QueryRoot.personByLabel
- QueryRoot.regionByLabel
- QueryRoot.speciesNameComplexByLabel
- QueryRoot.speciesNameEnding
- QueryRoot.speciesNameEndingByLabel
- QueryRoot.specimenByLabel
- QueryRoot.specimenComment
- QueryRoot.stratigraphicUnitByLabel
- QueryRoot.taxonByLabel
