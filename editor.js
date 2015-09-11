/**
 Copyright © Oleg Bogdanov
 Developer: Oleg Bogdanov
 Contacts: olegbogdanov86@gmail.com
 */

Vue.component('editor', {
    props: ['id', 'value', 'lang', 'opts'],
    template: '<textarea id="{{id}}" v-model="value"></textarea>',

    ready: function(){
        var self = this,
            isLoad = false;

        self.instance;
        self.id = self.id ? self.id : 'editor-'+self.GenerateHash(15);
        self.lang = self.lang ? self.lang : 'ru';

        self.onInit('//cdn.ckeditor.com/4.5.3/full/ckeditor.js');

        document.addEventListener("DOMContentLoaded", function(){
            var loading = setInterval(function(){
                if (typeof(CKEDITOR) != 'undefined' && isLoad == false){
                    self.onLoad();
                    isLoad = true;
                    clearInterval(loading);
                }
            },500);
        });
    },

    methods: {
        onInit: function(src){
            var newScript = document.createElement("script");
            newScript.type = "text/javascript";
            newScript.src =  src;
            var first = document.getElementsByTagName("head")[0].firstChild;
            document.getElementsByTagName("head")[0].insertBefore(newScript, first);
        },

        onLoad: function(){
            var self = this;

            var options = {
                language: self.lang,
                shiftEnterMode: CKEDITOR.ENTER_BR
            };
            self.opts = Vue.util.extend({}, options, (self.opts ? self.opts : {}));

            self.instance = CKEDITOR.replace(self.id, options);
            self.instance.on('change', self.onChange);
            self.instance.on('pasteState', self.onChange);
            self.instance.on('blur', self.onChange);
        },

        onChange: function(){
            var data = this.instance.getData();
            if (data == '') data = null;
            this.value = data;
        },

        GenerateHash: function (length) {
            var n, S = 'x',
                hash = function (s) {

                    if (typeof(s) == 'number' && s === parseInt(s, 10)) s = Array(s + 1).join('x');

                    return s.replace(/x/g, function () {
                        n = Math.round(Math.random() * 61) + 48;
                        n = n > 57 ? (n + 7 > 90 ? n + 13 : n + 7) : n;
                        return String.fromCharCode(n);
                    });
                };

            for (var i = 0; i < length; i++) S = S + 'x';
            return hash(S);
        }
    }
});