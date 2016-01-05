/* *************************************
 *  JS which has to be on top
 *************************************/

// Prevent firebug console break in IE or if firebug is disabled.
if (!window.console) {
    window.console = new function() {
        this.log = function(str) {};
        this.dir = function(str) {};
    };
}

var $j = jQuery.noConflict();

// Object.create support test, and fallback for browsers without it
if ( typeof Object.create !== 'function' ) {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

// Create a plugin based on a defined object
$j.plugin = function( name, object ) {
    $j.fn[name] = function( options ) {
        return this.each(function() {
            if ( ! $j.data( this, name ) ) {
                $j.data( this, name, Object.create(object).init(
                    options, this ) );
            }
        });
    };
};

var initAutoCompleteIndicator = function() {
    var elt = $j('#main-search');
    var bg = elt.css('background');
    Ajax.Responders.register({
        onCreate: function() {
            elt.css('background', 'transparent');
            elt.activity({
                segments: 10,
                steps: 3,
                width:2,
                space: 1,
                length:4,
                color: '#6B91BF',
                align: 'left'
            });
        },
        onComplete: function (){
            elt.activity(false);
            elt.css('background', bg);
        },
        onLoaded: function (){
            elt.activity(false);
            elt.css('background', bg);
        }
    });
};

// Region Updater
RegionUpdater = Class.create(RegionUpdater, {
    update: function($super) {
        $super();
        // reload fake select
        if (typeof dropdownReloadOptions === 'function') {
            if ($j(this.regionSelectEl).length > 0) {
                dropdownReloadOptions($j(this.regionSelectEl));
            }
        }
    }
});

Validation.add('validate-fr-phone','Le format du téléphone est incorrect. Exemple correct : 0102030405', function(v){
    return Validation.get('IsEmpty').test(v) || /^(0[0-9]{9})/.test(v);
});

Object.extend(Validation, {
    insertAdvice: function(elm, advice) {
        var container = $(elm).up('.fakeselect-wrapper');
        if (container) {
            Element.insert(container, {
                after: advice
            });
        } else if (elm.up('td.value')) {
            elm.up('td.value').insert({
                bottom: advice
            });
        } else if (elm.up('.selectbox')) {
            elm.up('.selectbox').insert({
                bottom: advice
            });
        } else if (elm.up('.filebox')) {
            elm.up('.filebox').insert({
                bottom: advice
            });
        } else if (elm.up('.radiobox')) {
            elm.up('.radiobox').insert({
                bottom: advice
            });
        } else if (elm.up('.checkbox')) {
            elm.up('.checkbox').insert({
                bottom: advice
            });
        } else if (elm.advaiceContainer && $(elm.advaiceContainer)) {
            $(elm.advaiceContainer).update(advice);
        } else if (elm.advaiceContainer && $(elm.advaiceContainer)) {
            $(elm.advaiceContainer).update(advice);
        } else {
            switch (elm.type.toLowerCase()) {
                case 'checkbox':
                case 'radio':
                    var p = elm.parentNode;
                    if (p) {
                        Element.insert(p, {
                            'bottom': advice
                        });
                    } else {
                        Element.insert(elm, {
                            'after': advice
                        });
                    }
                    break;
                default:
                    Element.insert(elm, {
                        'after': advice
                    });
            }
        }
    }
});

var removeParamFromUrl = function (key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";

    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }

    return rtn;
};
