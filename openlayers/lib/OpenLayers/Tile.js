/* Copyright (c) 2006 MetaCarta, Inc., published under the BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the full
 * text of the license. */
/*
 * OpenLayers.Tile 
 *
 * @class This is a class designed to designate a single tile, however
 * it is explicitly designed to do relatively little. Tiles store information
 * about themselves -- such as the URL that they are related to, and their 
 * size - but do not add themselves to the layer div automatically, for 
 * example.
 */
OpenLayers.Tile = Class.create();
OpenLayers.Tile.prototype = {
    
    /** @type String */
    id: null,
    
    /** @type OpenLayers.Layer */
    layer: null,
    
    /** @type String url of the request */
    url:null,

    /** @type OpenLayers.Bounds */
    bounds:null,
    
    /** @type OpenLayers.Size */
    size:null,
    
    /** Top Left pixel of the tile
    * @type OpenLayers.Pixel */
    position:null,

    /**
    * @constructor
    *
    * @param {OpenLayers.Layer} layer
    * @param {OpenLayers.Pixel} position
    * @param {OpenLayers.Bounds} bounds
    * @param {String} url
    * @param {OpenLayers.Size} size
    */   
    initialize: function(layer, position, bounds, url, size) {
        if (arguments.length > 0) {
            this.layer = layer;
            this.position = position;
            this.bounds = bounds;
            this.url = url;
            this.size = size;

            //give the tile a unique id based on its BBOX.
            this.id = OpenLayers.Util.createUniqueID("Tile_");
        }
    },
    
    /** nullify references to prevent circular references and memory leaks
    */
    destroy:function() {
        this.layer  = null;
        this.bounds = null;
        this.size = null;
        this.position = null;
    },

    /**
    */
    draw:function() {
    },

    redraw: function () {
        this.draw();
    },

    /** 
     * @param {OpenLayers.Bounds}
     * @param {OpenLayers.pixel} position
     */
    moveTo: function (bounds, position) {
        this.bounds = bounds.clone();
        this.position = position.clone();
        this.redraw();
    },


    /** Clear the tile of any bounds/position-related data so that it can 
     *   be reused in a new location.
     */
    clear: function() {
        this.bounds = null;
        this.position = null;
    },

    /**
    * @type OpenLayers.Pixel
    */
    getPosition: function() {
        return this.position;
    },
    
    /** @final @type String */
    CLASS_NAME: "OpenLayers.Tile"
};

