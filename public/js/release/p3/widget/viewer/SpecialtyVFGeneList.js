define("p3/widget/viewer/SpecialtyVFGeneList", [
	"dojo/_base/declare", "./TabViewerBase", "dojo/on", "dojo/topic",
	"dojo/dom-class", "dijit/layout/ContentPane", "dojo/dom-construct",
	"../PageGrid", "../formatter", "../SpecialtyVFGeneGridContainer", "../../util/PathJoin", "dojo/request", "dojo/_base/lang"
], function(declare, TabViewerBase, on, Topic,
			domClass, ContentPane, domConstruct,
			Grid, formatter, SpecialtyVFGeneGridContainer, 
			PathJoin, xhr, lang){
	return declare([TabViewerBase], {
		"baseClass": "SpecialtyVFGeneList",
		"disabled": false,
		"containerType": "spgene_ref_data",
		"query": null,
		defaultTab: "specialtyVFGenes",
		paramsMap: "query",
		perspectiveLabel: "Specialty Gene List View",
		perspectiveIconClass: "icon-selection-FeatureList",
		total_features: 0,
		warningContent: 'Your query returned too many results for detailed analysis.',
		_setQueryAttr: function(query){
			// console.log(this.id, " _setQueryAttr: ", query, this);
			// if (!query) { console.log("GENOME LIST SKIP EMPTY QUERY: ");  return; }
			// console.log("SetQuery: ", query, this);

			this._set("query", query);
			// console.log("query: ", query);			
			if(!this._started){
				return;
			}

			var _self = this;
			// console.log('spGeneList setQuery - this.query: ', this.query);

			//var url = PathJoin(this.apiServiceUrl, "sp_gene_ref", "?" + "eq(source,%22PATRIC_VF%22)" + "&limit(1)"); //&facet((field,genome_id),(limit,35000))");
			var url = PathJoin(this.apiServiceUrl, "sp_gene_ref", "?" + this.query + "&limit(1)"); //&facet((field,genome_id),(limit,35000))");

			// console.log("url: ", url);
			xhr.get(url, {
				headers: {
					accept: "application/solr+json",
					'X-Requested-With': null,
					'Authorization': (window.App.authorizationToken || "")
				},
				handleAs: "json"
			}).then(function(res){
				if(res && res.response && res.response.docs){
					var features = res.response.docs;
					// console.log("res.response: ", res.response);
					if(features){
						_self._set("total_features", res.response.numFound);
					}
				}else{
					console.warn("Invalid Response for: ", url);
				}
			}, function(err){
				console.error("Error Retreiving Specialty Genes: ", err);
			});

		},

		onSetState: function(attr, oldVal, state){
			// console.log(" onSetState()  OLD: ", oldVal, " NEW: ", state);

			this.inherited(arguments);
			this.set("query", state.search);
			this.setActivePanelState();
		},

		onSetQuery: function(attr, oldVal, newVal){
			this.queryNode.innerHTML = decodeURIComponent(newVal);
		},

		setActivePanelState: function(){

			var active = (this.state && this.state.hashParams && this.state.hashParams.view_tab) ? this.state.hashParams.view_tab : "specialtyVFGenes";
			// console.log("Active: ", active, "state: ", this.state);

			var activeTab = this[active];

			if(!activeTab){
				console.log("ACTIVE TAB NOT FOUND: ", active);
				return;
			}

			switch(active){
				case "specialtyVFGenes":
					activeTab.set("state", this.state);
					// console.log("state: ", this.state);
					break;
			}
			// console.log("Set Active State COMPLETE");
		},
/*
		onSetSpecialtyGeneIds: function(attr, oldVal, genome_ids){
			// console.log("onSetGenomeIds: ", genome_ids, this.feature_ids, this.state.feature_ids);
			this.state.feature_ids = feature_ids;
			this.setActivePanelState();
		},
*/
		postCreate: function(){
			this.inherited(arguments);

			this.watch("query", lang.hitch(this, "onSetQuery"));
			this.watch("total_features", lang.hitch(this, "onSetTotalSpecialtyGenes"));


			this.specialtyVFGenes = new SpecialtyVFGeneGridContainer({
				title: "Specialty Genes",
				id: this.viewer.id + "_" + "specialtyVFGenes",
				disabled: false,
			});
			this.viewer.addChild(this.specialtyVFGenes);

		},
		onSetTotalSpecialtyGenes: function(attr, oldVal, newVal){
			// console.log("ON SET TOTAL GENOMES: ", newVal);
			this.totalCountNode.innerHTML = " ( " + newVal + "  PATRIC_VF Genes ) ";
		},
		hideWarning: function(){
			if(this.warningPanel){
				this.removeChild(this.warningPanel);
			}
		},

		showWarning: function(msg){
			if(!this.warningPanel){
				this.warningPanel = new ContentPane({
					style: "margin:0px; padding: 0px;margin-top: -10px;",
					content: '<div class="WarningBanner">' + this.warningContent + "</div>",
					region: "top",
					layoutPriority: 3
				});
			}
			this.addChild(this.warningPanel);
		},
		onSetAnchor: function(evt){
			// console.log("onSetAnchor: ", evt, evt.filter);
			evt.stopPropagation();
			evt.preventDefault();

			var parts = [];
			if(this.query){
				var q = (this.query.charAt(0) == "?") ? this.query.substr(1) : this.query;
				if(q != "keyword(*)"){
					parts.push(q);
				}
			}
			if(evt.filter){
				parts.push(evt.filter);
			}

			// console.log("parts: ", parts);

			if(parts.length > 1){
				q = "?and(" + parts.join(",") + ")";
			}else if(parts.length == 1){
				q = "?" + parts[0];
			}else{
				q = "";
			}

			// console.log("SetAnchor to: ", q);
			var hp;
			if(this.hashParams && this.hashParams.view_tab){
				hp = {view_tab: this.hashParams.view_tab};
			}else{
				hp = {};
			}
			l = window.location.pathname + q + "#" + Object.keys(hp).map(function(key){
					return key + "=" + hp[key];
				}, this).join("&");
			// console.log("NavigateTo: ", l);
			Topic.publish("/navigate", {href: l});
		}
	});
});
