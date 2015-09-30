define([
	"dojo/_base/declare", "dijit/layout/BorderContainer", "dojo/on",
	"dojo/dom-class", "dijit/layout/ContentPane", "dojo/dom-construct",
	"../formatter", "dijit/layout/TabContainer", "../GenomeOverview",
	"dojo/request", "dojo/_base/lang", "../FeatureGridContainer", "../SpecialtyGeneGridContainer",
	"../ActionBar", "../ContainerActionBar", "../PathwaysContainer", "../ProteinFamiliesContainer",
	"../DiseaseContainer", "../PublicationGridContainer", "../CircularViewerContainer",
	"../TranscriptomicsContainer"/*,"JBrowse/Browser"*/, "../InteractionsContainer"
], function(declare, BorderContainer, on,
			domClass, ContentPane, domConstruct,
			formatter, TabContainer, GenomeOverview,
			xhr, lang, FeatureGridContainer, SpecialtyGeneGridContainer,
			ActionBar, ContainerActionBar, PathwaysContainer, ProteinFamiliesContainer,
			DiseaseContainer, PublicationGridContainer, CircularViewerContainer,
			TranscriptomicsContainer/*, JBrowser*/, InteractionsContainer) {
	return declare([BorderContainer], {
		"baseClass": "GenomeGroup",
		"disabled": false,
		"query": null,
		containerType: "genome_group",
		params: null,
		genome_id: "",
		apiServiceUrl: window.App.dataAPI,
		_setParamsAttr: function(params) {
			this.set("genome_id", params);
		},
		_setGenome_idAttr: function(id) {
			this.genome_id = id;
			xhr.get(this.apiServiceUrl + "/genome/" + id, {
				headers: {
					accept: "application/json"
				},
				handleAs: "json"
			}).then(lang.hitch(this, function(genome) {
				this.genome = genome;
				console.log("Genome: ", genome);
				if(this._started){
					this.refresh();
				}
			}));
		},
		_setQueryAttr: function(query) {
			this.query = query;
			if(this.viewer){
				this.viewer.set("query", query);
			}
		},
		removeRows: function(ids) {
			ids.forEach(function(id) {
				var row = this.viewer.row(id);
				this.viewer.removeRow(row.element);
			}, this);
		},
		refresh: function() {
			this.viewHeader.set("content", this.genome.taxon_lineage_names.slice(1).join("&nbsp;&raquo;&nbsp;"));
			this.genomeOverview.set('genome', this.genome);
			this.features.set("query", "?eq(genome_id," + this.genome.genome_id + ")");
			this.specialtyGenes.set("query", "?eq(genome_id," + this.genome.genome_id + ")");
			//this.pathways.set("query", "?eq(genome_id," + this.genome.genome_id + ")&eq(annotation,PATRIC)");
			this.pathways.set("params", {genome_id: this.genome.genome_id, annotation:'PATRIC'});
		},
		postCreate: function() {
			//if (this._started) {return;}
			this.inherited(arguments);
			this.viewHeader = new ContentPane({content: "Genome", region: "top"});
			this.viewer = new TabContainer({region: "center"});
			this.genomeOverview = new GenomeOverview({title: "Overview", style: "overflow:auto;"});
			this.phylogeny = new ContentPane({content: "Phylogeny", title: "Phylogeny"});
			//var gbContentPane = new ContentPane({title: "Genome Browser", content: '<div id="' + this.id + "_jbrowse" + '"></div>'});
			//this.circularViewer = new CircularViewerContainer({title: "Circular Viewer"});

			this.features = new FeatureGridContainer({title: "Features"});
			this.specialtyGenes = new SpecialtyGeneGridContainer({title: "Specialty Genes"});
			this.pathways = new PathwaysContainer({title: "Pathways"});
			this.proteinFamilies = new ProteinFamiliesContainer({title: "Protein Families"});
			this.transcriptomics = new TranscriptomicsContainer({title: "Transcriptomics"});
			//this.interactions= new InteractionsContainer({title: "Interactions"});
			//this.diseases= new DiseaseContainer({title: "Diseases"});
			//this.literature= new PublicationGridContainer({content: "Literature", title: "Literature"});
			this.viewer.addChild(this.genomeOverview);
			this.viewer.addChild(this.phylogeny);
			//this.viewer.addChild(gbContentPane);
			//this.viewer.addChild(this.circularViewer);
			this.viewer.addChild(this.features);
			this.viewer.addChild(this.specialtyGenes);
			this.viewer.addChild(this.pathways);
			this.viewer.addChild(this.proteinFamilies);
			this.viewer.addChild(this.transcriptomics);
			//this.viewer.addChild(this.interactions);
			//this.viewer.addChild(this.diseases);
			//this.viewer.addChild(this.literature);
			this.addChild(this.viewHeader);
			this.addChild(this.viewer);
//			this.genomeBrowser= new JBrowser({
//				title: "Genome Browser",
////				include: [],
////				css: [],
//				dataRoot: "/public/js/jbrowse.repo/sample_data/json/volvox",
//				nameUrl: "{dataRoot}/names/meta.json",
//				containerID: this.id + "_jbrowse",
//				updateBrowserURL:false,
//				stores: { url: { type: "JBrowse/Store/SeqFeature/FromConfig", features: [] } },
//			});
		},
		startup: function() {
			if(this._started){
				return;
			}
			this.inherited(arguments);
			if(this.genome){
				this.refresh();
			}
		}
	});
});
