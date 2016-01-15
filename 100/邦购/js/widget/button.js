// JavaScript Document

(function ($, undefined) {
    var iconRE = /\bui\-icon\-(\w+)\b/ig,
        iconposRE = /\bui\-button\-icon\-pos\-(\w+)\b/ig;

    $.ui.define('button', {
        _data:{
            disabled: false, // true | false
            selected: false, //true | false
            label: '',
            alttext: '', 
            type: 'button', // button | checkbox | radio | input 
            icon: '',//home | delete | plus | arrow-u | arrow-d | check | gear | grid | star | arrow-r | arrow-l | minus | refresh | forward | back | alert | info | search | custom
            iconpos: '',//left, top, right, bottom
            attributes: null,
            container: null
        },

        _createDefEL: function(){
            return $('<button>');
        },

        _prepareBtnEL: function(mode){
            return this.root();
        },

        _prepareDom : function(mode){
            var data = this._data, $el = this.root(), key;
            if(mode=='create'){
                (data.label || data.alttext) && (data._textSpan = $('<span class="ui-button-text">'+(data.label || data.alttext)+'</span>').appendTo(data._buttonElement));
                data.icon && (data._iconSpan = $('<span class="ui-icon ui-icon-'+data.icon+'"></span>').appendTo(data._buttonElement));
            } else if(mode == 'fullsetup') {
                data._textSpan = $('.ui-button-text', data._buttonElement);
                key = data._buttonElement.hasClass('ui-button-icon-only')?'alttext':'label';
                data[key] = data[key] || data._textSpan.text();
                data._iconSpan = $('.ui-icon', data._buttonElement);
                data.icon = data.icon || data._iconSpan.attr('class').match(iconRE) && RegExp.$1;
                data.iconpos = data.iconpos || data._buttonElement.attr('class').match(iconposRE) && RegExp.$1;
            } else {
                data.label = data.label || data._buttonElement.text() || $el.val();
                data.alttext = data.alttext || $el.attr('data-alttext');
                data.icon = data.icon || $el.attr('data-icon');
                data.iconpos = data.iconpos || $el.attr('data-iconpos');

                data._buttonElement.empty();
                data.icon && (data._iconSpan = $('<span class="ui-icon ui-icon-'+data.icon+'"></span>').appendTo(data._buttonElement));
                (data.label || data.alttext) && (data._textSpan = $('<span class="ui-button-text">'+(data.label || data.alttext)+'</span>').appendTo(data._buttonElement));
            }
        },

        _create: function () {
            var me = this, $el, data = me._data;

            !data.icon && !data.label && (data.label = '');

            $el = me._el || (me.root(me._createDefEL()));
            data._buttonElement = me._prepareBtnEL('create');
            me._prepareDom('create');
            $el.appendTo(data._container = $(data.container||'body'));
            data._buttonElement !== $el && data._buttonElement.insertAfter($el);
        },

        _detectType: function(){
            return 'button';
        },

        _setup: function( mode ){
            var me = this, data = me._data;
            mode = mode?'fullsetup':'setup';
            data.type = me._detectType();
            data._buttonElement = me._prepareBtnEL(mode);
            me._prepareDom( mode );
        },

        _prepareClassName: function(){
            var me = this,
                data = me._data,
                className = 'ui-button';

            className += data.label && data.icon ? ' ui-button-text-icon ui-button-icon-pos-'+(data.iconpos||'left') :
                data.label ? ' ui-button-text-only' : ' ui-button-icon-only';
            className += data.disabled?' ui-state-disable':'';
            className += data.selected?' ui-state-active':'';
            return className;
        },

        _init: function(){
            var me = this,
                $el = me.root(),
                data = me._data,
                className = me._prepareClassName();

            data.attributes && $el.attr(data.attributes);
            $el.prop('disabled', !!data.disabled);
            data._buttonElement.addClass(className).highlight(data.disabled?'':'ui-state-hover');

            data._buttonElement.on('click', $.proxy(me._eventHandler, me));
            $.each(['click', 'change'], function(){ 
                data[this] && me.on(this, data[this]);
                delete data[this];
            });
        },

        _eventHandler:function (event) {
            var data = this._data;
            if(data.disabled) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        },

        _setState:function (enable) {
            var data = this._data, change = data.disabled != !enable;
            if(change){
                data.disabled = !enable;
                data._buttonElement[enable?'removeClass':'addClass']('ui-state-disable').highlight(enable?'ui-state-hover':'');;
                this.trigger('statechange', enable);
            }
            return this;
        },

        enable:function () {
            return this._setState(true);
        },

        disable:function () {
            return this._setState(false);
        },

        toggleEnable:function () {
            var data = this._data;
            return this._setState(data.disabled);
        },

        _setSelected: function(val){
            var data = this._data;
            if(data.selected != val){
                data._buttonElement[ (data.selected = val) ? 'addClass':'removeClass' ]('ui-state-active');
                this.trigger('change');
            }
            return this;
        },

        select: function(){
            return this._setSelected(true);
        },

        unselect: function(){
            return this._setSelected(false);
        },

        toggleSelect: function(){
            return this._setSelected(!this._data.selected);
        },

        destroy: function(){
            var me = this, data = this._data;
            data._buttonElement.off('click', me._eventHandler).highlight();
            data._buttonElement.remove();
            me.$super('destroy');
        }


    });
})(Zepto);