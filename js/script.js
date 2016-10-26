var DEMO = (function( $ ) {
    'use strict';

    var $grid = $('#grid'),
        $filterOptions = $('.filter-options'),
        $sizer = $grid.find('.shuffle__sizer'),

        init = function() {


            // None of these need to be executed synchronously
            listen();
            setupFilters();
            setupSorting();
            setupSearching();

            // You can subscribe to custom events.
            // shrink, shrunk, filter, filtered, sorted, load, done
            $grid.on('loading.shuffle done.shuffle shrink.shuffle shrunk.shuffle filter.shuffle filtered.shuffle sorted.shuffle layout.shuffle', function(evt, shuffle) {
                // Make sure the browser has a console
                if ( window.console && window.console.log && typeof window.console.log === 'function' ) {
                    console.log( 'Shuffle:', evt.type );
                }
            });

            // instantiate the plugin
            $grid.shuffle({
                itemSelector: '.grid_item',
                sizer: $sizer
            });

            // Destroy it! o_O
        },



    // Set up button clicks
        setupFilters = function() {
            var $btns = $filterOptions.children();
            $btns.on('click', function() {
                var $this = $(this),
                    isActive = $this.hasClass( 'active' ),
                    group = isActive ? 'all' : $this.data('group');

                // Hide current label, show current label in title
                if ( !isActive ) {
                    $('.filter-options .active').removeClass('active');
                }

                $this.toggleClass('active');

                // Filter elements
                $grid.shuffle( 'shuffle', group );
            });

            $btns = null;
        },

        setupSorting = function() {
            // Sorting options
            $('.sort-options').on('change', function() {
                var sort = this.value,
                    opts = {};

                // We're given the element wrapped in jQuery
                if ( sort === 'date-created' ) {
                    opts = {
                        reverse: true,
                        by: function($el) {
                            return $el.data('date-created');
                        }
                    };
                } else if ( sort === 'title' ) {
                    opts = {
                        by: function($el) {
                            return $el.data('title').toLowerCase();
                        }
                    };
                }

                // Filter elements
                $grid.shuffle('sort', opts);
            });
        },

        setupSearching = function() {
            // Advanced filtering
            $('.js-shuffle-search').on('keyup change', function() {
                var val = this.value.toLowerCase();
                $grid.shuffle('shuffle', function($el, shuffle) {

                    // Only search elements in the current group
                    if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === -1) {
                        return false;
                    }

                    var text = $.trim( $el.find('.grid_item__title').text() ).toLowerCase();
                    return text.indexOf(val) !== -1;
                });
            });
        },

    // Re layout shuffle when images load. This is only needed
    // below 768 pixels because the .grid_item height is auto and therefore
    // the height of the grid_item is dependent on the image
    // I recommend using imagesloaded to determine when an image is loaded
    // but that doesn't support IE7
        listen = function() {

            // Get all images inside shuffle
            $grid.find('img').each(function() {
                var proxyImage;

                // Image already loaded
                if ( this.complete && this.naturalWidth !== undefined ) {
                    return;
                }

                // If none of the checks above matched, simulate loading on detached element.
                proxyImage = new Image();
                $( proxyImage ).on('load', function() {
                    $(this).off('load');
                    $grid.shuffle('update');
                });

                proxyImage.src = this.src;
            });

            // Because this method doesn't seem to be perfect.
            setTimeout(function() {
                $grid.shuffle('update');
            }, 500);
        };

    return {
        init: init
    };
}( jQuery ));

var nice = false;
jQuery(document).ready(function () {
    nice = $("body").niceScroll().hide();
    DEMO.init();
/*    if (Modernizr.mq('only screen and (max-width: 991px)')) {
        $('.viral-menu').addClass('compact');
    } else {
        $('.viral-menu').removeClass('compact');
    }*/
    $(".button-collapse").sideNav();
    $(".dropdown-button").dropdown({ hover: true });
    $('.slider').slider({full_width: true});

    var $HomeHead = $('#home_section');

    $HomeHead.css({
        height:  $(window).outerHeight()
        //width:   $(window).outerWidth(true)
    });
    function sniffer(){
        $HomeHead.css({
            height:  ($(window).outerHeight() - 80)
            //width:   $(window).outerWidth(true)
        });

    }
    sniffer();

    $(window).resizeEnd({}, function() {
        sniffer();
    });


});
