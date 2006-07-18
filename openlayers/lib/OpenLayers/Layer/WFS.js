/* Copyright (c) 2006 MetaCarta, Inc., published under the BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the full
 * text of the license. */
// @require: OpenLayers/Layer/Grid.js
// @require: OpenLayers/Layer/Markers.js
/**
* @class
*/
OpenLayers.Layer.WFS = Class.create();
OpenLayers.Layer.WFS.prototype = 
  Object.extend(new OpenLayers.Layer.Grid(),
    Object.extend(new OpenLayers.Layer.Markers(), {

    /** Allow the user to specify special classes for features and tiles.
     * 
     *   This allows for easy-definition of behaviour. The defaults are 
     *    set here, but to override it, the property should be set via 
     *    the "options" parameter.
     */
     
    /** @type Object */
    featureClass: OpenLayers.Feature.WFS,

    /** @type Object */
    tileClass: OpenLayers.Tile.WFS,

    /** @final @type hash */
    DEFAULT_PARAMS: { service: "WFS",
                      version: "1.0.0",
                      request: "GetFeature",
                      typename: "docpoint"
                    },

    /**
    * @constructor
    *
    * @param {str} name
    * @param {str} url
    * @param {hash} params
    * @param {Object} options Hash of extra options to tag onto the layer
    */
    initialize: function(name, url, params, options) {
        var newArguments = new Array();
        if (arguments.length > 0) {
            //uppercase params
            params = OpenLayers.Util.upperCaseObject(params);
            newArguments.push(name, url, params, options);
        }
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        OpenLayers.Layer.Markers.prototype.initialize.apply(this, newArguments);
    
        if (arguments.length > 0) {
            OpenLayers.Util.applyDefaults(
                           this.params, 
                           OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS)
                           );
        }
    },    
    

    /**
     * 
     */
    destroy: function() {
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);
        OpenLayers.Layer.Markers.prototype.destroy.apply(this, arguments);
    },
    
    /**
     * @param {OpenLayers.Map} map
     */
    setMap: function(map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        OpenLayers.Layer.Markers.prototype.setMap.apply(this, arguments);
    },
    
    /** 
     * @param {OpenLayers.Bounds} bounds
     * @param {Boolean} zoomChanged
     * @param {Boolean} minor
     */
    moveTo:function(bounds, zoomChanged, minor) {
        OpenLayers.Layer.Grid.prototype.moveTo.apply(this, arguments);
        OpenLayers.Layer.Markers.prototype.moveTo.apply(this, arguments);
    },
    
    /** WFS layer is never a base class. 
     * @type Boolean
     */
    isBaseLayer: function() {
        return false;
    },
    
    /**
     * @param {Object} obj
     * 
     * @returns An exact clone of this OpenLayers.Layer.WMS
     * @type OpenLayers.Layer.WMS
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.WFS(this.name,
                                           this.url,
                                           this.params,
                                           this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    


    /**
    * addTile creates a tile, initializes it (via 'draw' in this case), and 
    * adds it to the layer div. 
    *
    * @param {OpenLayers.Bounds} bounds
    *
    * @returns The added OpenLayers.Tile.WFS
    * @type OpenLayers.Tile.WFS
    */
    addTile:function(bounds, position) {
        var urls = new Array();

        //add standard URL
        urls.push( this.getFullRequestString( { BBOX:bounds.toBBOX() }) );

        if (this.urls != null) {
            // if there are more urls, add them.
            for(var i=0; i < this.urls.length; i++) {
                var newUrl = this.getFullRequestString( { BBOX:bounds.toBBOX() },
                                                        this.urls[i] );
                urls.push(newUrl);
            }
        }

        return new this.tileClass(this, position, bounds, 
                                           urls, this.tileSize);
    },



    /**
     * Catch changeParams and uppercase the new params to be merged in
     *  before calling changeParams on the super class.
     * 
     * Once params have been changed, we will need to re-init our tiles
     * 
     * @param {Object} params Hash of new params to use
     */
    mergeNewParams:function(params) {
        var upperParams = OpenLayers.Util.upperCaseObject(params);
        var newArguments = [upperParams];
        OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, newArguments);

        if (this.grid != null) {
            this._initTiles();
        }
    },

    /** combine the layer's url with its params and these newParams. 
    *   
    *    Add the SRS parameter from getProjection() -- this is probably
    *     more eloquently done via a setProjection() method, but this 
    *     works for now and always.
    * 
    * @param {Object} newParams
    * 
    * @type String
    */
    getFullRequestString:function(newParams) {
        var projection = this.map.getProjection();
        this.params.SRS = (projection == "none") ? null : projection;

        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
                                                    this, arguments);
    },
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Layer.WFS"
}
)
);
