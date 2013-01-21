(function($) {
    $.replicator = function(el, text, options){
        var base = this;

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("replicator", base);

        // Set up instance variables
        base.tweets = [];

        base.init = function(){
            if( typeof( term ) === "undefined" || term === null ) term = "";

            base.text = text;

            base.identifier = "ident";

            base.options = $.extend({},$.replicator.defaultOptions, options);

            base.tweets = base.generateTweets(base.text);

            base.render();
        };

        base.generateTweets = function(text) {
            var parse_into_messages = function(text) {
                var i = 0;
                var messages = [];
                while(i < text.length) {
                    if(i + base.options.max_size > text.length - 1) {
                        messages.push(text.substring(i, text.length));
                        return messages;
                    }
                    next_message = text.substring(i, i + base.options.min_size - 1);
                    candidates = text.substring(i + base.options.min_size - 1, i + base.options.max_size - 1);
                    i += base.options.min_size - 1;

                    for(var j in candidates) {
                        var ch = candidates[j];
                        next_message += ch;
                        i += 1;
                        if((base.options.break_chars).indexOf(ch) != -1 || (ch == " " && j > base.options.max_size - base.options.min_size - base.options.cutoff_threshold) || j == base.options.max_size - base.options.min_size) {
                            messages.push(next_message);
                            break;
                        }
                    }
                }

                return messages;
            }
            var generate_checksums = function(messages) {
                var mod_checksums = [];
                for(var x in messages) {
                    var message = messages[x];
                    var total = 1;
                    for(var y in message) {
                        var ch = message[y];

                        total = (total * ch.charCodeAt(0)) % 61
                    }
                    mod_checksums.push(total + " ");
                }
                var message_checksums = [];
                for(var i in mod_checksums) {
                    var checksum = "";
                    checksum += base.options.checksum_type + " ";
                    checksum += mod_checksums[(i==0?mod_checksums.length:i)-1];
                    checksum += mod_checksums[((i==mod_checksums.length-1?-1:i)+1) % mod_checksums.length];
                    checksum += messages.length + " ";
                    checksum += i;
                    message_checksums.push(checksum);
                }
                return message_checksums
            }
            var int_to_ascii = function(n) {
                return n;
            }

            var messages = parse_into_messages(text);
            var checksums = generate_checksums(messages);
            var tweets = [];

            for(var x in messages) {
                tweets.push(messages[x] + " #" + base.identifier + " " + checksums[(x==0?messages.length:x)-1]);
            }
            return tweets;
        }

        base.render = function() {
            base.$el.empty();

            for(var x in base.tweets) {
                var $container = $("<div />")
                    .addClass("tweet")
                    .appendTo(base.$el);

                var $text = $("<div />")
                    .addClass("text")
                    .text(base.tweets[x])
                    .appendTo($container);

                var $tweetLink = $("<a />")
                    .addClass("link")
                    .attr("target", "_blank")
                    .attr("href", "https://twitter.com/share?text=" + encodeURIComponent(base.tweets[x]))
                    .text("Replicate")
                    .appendTo($container);

            }

        }

        // Run initializer
        base.init();
    };

    $.replicator.defaultOptions = {
        break_chars: ".?!",
        min_size: 40,
        max_size: 110,
        cutoff_threshold: 15,
        checksum_type: 1
    };

    $.fn.replicator = function(term, options){
        return this.each(function(){
            (new $.replicator(this, term, options));
        });
    };
})(jQuery)