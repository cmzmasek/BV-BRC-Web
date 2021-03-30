  //,'archaeopteryx/archaeopteryx-dependencies/jquery-1.12.4'
define([
  'dojo/_base/declare'
  ,'dijit/_WidgetBase'
  ,'dojo/text!./templates/VariantLineagePhlyogenyTreeViewer.html'
  ,'dojo/on'
  ,'dojo/dom-class'
  ,'dijit/_WidgetsInTemplateMixin'
  ,'dijit/_TemplatedMixin'
  ,'dojo/topic'
  ,'dojo/dom-construct'
  ,'archaeopteryx/archaeopteryx-dependencies/d3.v3.min'
  ,'jquery/dist/jquery'
  ,'archaeopteryx/archaeopteryx-dependencies/jquery-ui'
  ,'archaeopteryx/archaeopteryx-dependencies/sax'
  ,'StackBlur/dist/stackblur'
  ,'archaeopteryx/archaeopteryx-dependencies/rgbcolor'
  ,'archaeopteryx/archaeopteryx-dependencies/Blob'
  ,'archaeopteryx/archaeopteryx-dependencies/canvas-toBlob'
  ,'archaeopteryx/archaeopteryx-dependencies/canvg'
  ,'archaeopteryx/archaeopteryx-dependencies/FileSaver'
  ,'phyloxml/phyloxml'
  ,'archaeopteryx/archaeopteryx-js/forester'
  ,'archaeopteryx/archaeopteryx-js/archaeopteryx'
], function (
  declare
  , WidgetBase
  , Template
  ,on
  ,domClass
  ,WiT
  ,Templated
  ,Topic
  ,domConstruct
  ,d3
  ,jquery
  ,jquery_ui
  ,sax
  ,stackblur
  ,rgbcolor
  ,Blob
  ,canvastoBlob
  ,canvg
  ,FileSaver
  ,phyloxml
  ,forester
  ,archaeopteryx
) {
  return declare([WidgetBase, Templated], {
    baseClass: 'VariantLineagePhlyogenyTreeViewer',
    disabled: false,
    templateString: Template,
    apiServiceUrl: window.App.dataAPI,
    constructor: function () {
        var self = this;
        this.archaeopteryx = archaeopteryx;
      },
    startup: function () {
      if (this._started) {
        return;
      }
      this.inherited(arguments);
      this.load();
    },
    load: function () {
      require(['archaeopteryx/archaeopteryx-js/archaeopteryx'], function (archaeopteryx){
        var options = {};
        options.alignPhylogram = false; // We should launch with "regular" phylogram.
        options.defaultFont = ['Arial', 'Helvetica', 'Times'];
        options.minBranchLengthValueToShow = 0.001;
        options.minConfidenceValueToShow = 50;
        options.phylogram = true; // We should launch with "regular" phylogram.
        //options.searchAinitialValue = '#';
        options.showBranchVisualizations = true; // For MSA residue visualization.
        options.showConfidenceValues = true;
        options.showExternalLabels = true;
        options.showNodeName = true;
        options.showNodeVisualizations = true;
        options.showSequence = false; // Do not show "Sequence" upon launch.
        options.showSequenceAccession = true; // If user turns on "Sequence" display, accession will be shown.
        options.searchProperties = true;
        options.showVisualizationsLegend = true;
        options.visualizationsLegendOrientation = 'vertical';
        options.visualizationsLegendXpos = 160;
        options.visualizationsLegendYpos = 30;

        var settings = {};

        settings.border = '1px solid #909090';
        settings.controls0Top = 10;
        settings.controls1Top = 10; // Should have both boxes in line.
        // settings.displayHeight = 700;
        // settings.displayWidth = 1200;
        settings.enableAccessToDatabases = true;
        settings.enableBranchVisualizations = true; // For MSA residue visualization.
        settings.enableCollapseByFeature = true;
        settings.enableDownloads = true;
        settings.enableMsaResidueVisualizations = true; // For MSA residue visualization.
        settings.enableNodeVisualizations = true;
        settings.enableDynamicSizing = true;
        settings.enableSpecialVisualizations2 = true;
        settings.enableSpecialVisualizations3 = true;
        settings.enableSpecialVisualizations4 = true;
        settings.nhExportWriteConfidences = true;
        //settings.readSimpleCharacteristics = true; // To be deprecated!
        settings.searchFieldWidth = '50px';
        settings.collapseLabelWidth = '36px';
        settings.textFieldHeight = '16px';
        settings.showShortenNodeNamesButton = false;
        settings.showDynahideButton = false;
        settings.showSearchPropertiesButton = true;
        //settings.specialProcessing = ['ird_split_avian_host']; // NEW

        settings.dynamicallyAddNodeVisualizations = true;

        settings.propertiesToIgnoreForNodeVisualization = ['AccessionNumber', 'Mutation'];

        settings.valuesToIgnoreForNodeVisualization = {
            'vipr:Year': ['1111'],
            'ird:Year': ['1111'],
            'vipr:Country': ['-N/A-'],
            'ird:Country': ['-N/A-']
        };

        var decorator = 'vipr:';

        var nodeVisualizations = {};

        nodeVisualizations['PANGO_Lineage'] = {
            label: 'PANGO Lineage',
            description: 'the PANGO Lineage',
            field: null,
            cladeRef: decorator + 'PANGO_Lineage',
            regex: false,
            shapes: ['square', 'diamond', 'triangle-up', 'triangle-down', 'cross', 'circle'],
            colors: 'category50',
            sizes: null
        };

        nodeVisualizations['PANGO_Lineage_L0'] = {
            label: 'PANGO Lineage Lvl 0',
            description: 'the PANGO Lineage Level 0',
            field: null,
            cladeRef: decorator + 'PANGO_Lineage_L0',
            regex: false,
            shapes: ['square', 'diamond', 'triangle-up', 'triangle-down', 'cross', 'circle'],
            colors: 'category50',
            sizes: null
        };

        nodeVisualizations['PANGO_Lineage_L1'] = {
            label: 'PANGO Lineage Lvl 1',
            description: 'the PANGO Lineage Level 1',
            field: null,
            cladeRef: decorator + 'PANGO_Lineage_L1',
            regex: false,
            shapes: ['square', 'diamond', 'triangle-up', 'triangle-down', 'cross', 'circle'],
            colors: 'category50',
            sizes: null
        };

        nodeVisualizations['Host'] = {
            label: 'Host',
            description: 'the host of the virus',
            field: null,
            cladeRef: decorator + 'Host',
            regex: false,
            shapes: ['square', 'diamond', 'triangle-up', 'triangle-down', 'cross', 'circle'],
            colors: 'category10',
            sizes: null
        };

        nodeVisualizations['Country'] = {
            label: 'Country',
            description: 'the country of the virus',
            field: null,
            cladeRef: decorator + 'Country',
            regex: false,
            shapes: ['square', 'diamond', 'triangle-up', 'triangle-down', 'cross', 'circle'],
            colors: 'category50',
            sizes: null
        };

        nodeVisualizations['Year'] = {
            label: 'Year',
            description: 'the year of the virus',
            field: null,
            cladeRef: decorator + 'Year',
            regex: false,
            shapes: ['square', 'diamond', 'triangle-up', 'triangle-down', 'cross', 'circle'],
            colors: 'category50',
            colorsAlt: ['#000000', '#00FF00'],
            sizes: [10, 40]
        };

        nodeVisualizations['Region'] = {
            label: 'Region',
            description: 'the region of change',
            field: null,
            cladeRef: decorator + 'Region',
            regex: false,
            shapes: ['square', 'diamond', 'triangle-up', 'triangle-down', 'cross', 'circle'],
            colors: 'category50',
            sizes: null
        };

        var specialVisualizations = {};

        specialVisualizations['Mutations'] = {
            label: 'Mutations',
            applies_to_ref: 'vipr:Mutation',
            property_datatype: 'xsd:string',
            property_applies_to: 'node',
            color: '#0000FF',
            property_values: ['S:A243-', 'S:A570D', 'S:A701V', 'S:D1118H', 'S:D138Y', 'S:D215G', 'S:D614G',
                'S:D80A', 'S:E484K', 'S:H655Y', 'S:H69-', 'S:K417N', 'S:K417T', 'S:L18F', 'S:L242-', 'S:L244-',
                'S:L452R', 'S:N501Y', 'S:P26S', 'S:P681H', 'S:R190S', 'S:R246I', 'S:S13I', 'S:S982A',
                'S:T1027I', 'S:T20N', 'S:T716I', 'S:V1176F', 'S:V70-', 'S:W152C']
        };

        specialVisualizations['Convergent_Mutations'] = {
            label: 'Convergent Mutations',
            applies_to_ref: 'vipr:Mutation',
            property_datatype: 'xsd:string',
            property_applies_to: 'node',
            color: '#FF0000',
            property_values: ['S:D614G', 'S:E484K', 'S:H69-', 'S:K417N', 'S:K417T', 'S:L18F', 'S:N501Y', 'S:V70-']
        };

        specialVisualizations['vipr:PANGO_Lineage'] = {
            label: 'Lineages of Concern',
            applies_to_ref: 'vipr:PANGO_Lineage',
            property_datatype: 'xsd:string',
            property_applies_to: 'node',
            color: '#FF0000',
            property_values: ['B.1.1.7', 'B.1.351', 'B.1.1.28', 'B.1.429', 'B.1.375']
        };

        //var loc = 'http://www.phyloxml.org/archaeopteryx-js/phyloxml_trees/VIPR_SARS2_29400_09999_ni_3_PANGO_lineages_MAFFT_05_tree_1_fme_p2dvvm.xml';
        var loc = 'http://localhost:3030/public/js/p3/widget/templates/Archaeopteryx/VIPR_SARS2_29400_09999_ni_3_PANGO_lineages_MAFFT_05_tree_1_fme_p2dvvm.xml';

        jQuery.get(loc,
                function (data) {
                    var tree = null;
                    try {
                        tree = archaeopteryx.parsePhyloXML(data);
                    }
                    catch (e) {
                        alert("error while parsing tree: " + e);
                    }
                    if (tree) {
                        try {
                            archaeopteryx.launch('#phylogram1', tree, options, settings, nodeVisualizations, specialVisualizations);
                        }
                        catch (e) {
                            alert("error while launching archaeopteryx: " + e);
                        }
                    }
                },
                "text")
                .fail(function () {
                    alert("error: failed to read tree(s) from \"" + loc + "\"");
                });
      });
    }
    });

});
