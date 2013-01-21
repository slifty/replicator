(function($) {
    var CHAR_MAP = [33,34,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190];
    var ID_CHAR_MAP = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; 
    var int_to_ascii = function(x, character_count) {
        if(x > CHAR_MAP.length*CHAR_MAP.length)
            return ("[ERR: TOO LARGE]");
        if(x < CHAR_MAP.length && character_count != 2)
            return String.fromCharCode(CHAR_MAP[x]);
        return String.fromCharCode(CHAR_MAP[Math.floor(x/CHAR_MAP.length)]) + String.fromCharCode(CHAR_MAP[x % CHAR_MAP.length]);
    }

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

            base.options = $.extend({},$.replicator.defaultOptions, options);

            if("identifier" in base.options) {
                base.identifier = base.options.identifier;
                $.ajax({
                    url: "recipes/" + base.identifier,
                    method: "GET"
                })
                .done(function(html) {
                    base.$el.html(html);
                })
                return;
            }

            base.identifier = 'CD_';
            for(var x = 0; x < 7; ++x)
                base.identifier += ID_CHAR_MAP[Math.floor(Math.random() * ID_CHAR_MAP.length)];


            base.tweets = base.generateTweets(base.text);

            base.render();
        };

        base.generateTweets = function(text) {
            var parse_into_messages = function(text) {
                var i = 0;
                var messages = [];
                while(i < text.length) {
                    if(i + base.options.max_size > text.length - 1) {
                        messages.push($.trim(text.substring(i, text.length)));
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
                            messages.push($.trim(next_message));
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
                    mod_checksums.push(total);
                }
                var message_checksums = [];
                for(var i in mod_checksums) {
                    var checksum = "";
                    checksum += int_to_ascii(base.options.checksum_type);
                    checksum += int_to_ascii(mod_checksums[(i==0?mod_checksums.length:i)-1]);
                    checksum += int_to_ascii(mod_checksums[(1 + parseInt(i)) % mod_checksums.length]);
                    checksum += int_to_ascii(messages.length,2);
                    checksum += int_to_ascii(i, 2);
                    message_checksums.push(checksum);
                }
                return message_checksums
            }

            var messages = parse_into_messages(text);
            var checksums = generate_checksums(messages);
            var tweets = [];

            for(var x in messages) {
                tweets.push(messages[x] + " #" + base.identifier + " " + checksums[x]);
            }
            return tweets;
        }

        base.render = function() {
            base.$el.empty();

            var $instructions = $("<div />")
                .addClass("instructions")
                .appendTo(base.$el);

            var $headline = $("<h2 />")
                .text("Recipe Generated: Now What?")
                .appendTo($instructions);

            var $details1 = $("<p />")
                .html("<strong>First:</strong> Ask everyone you know to ")
                .appendTo($instructions);

            var $helpLink = $("<a />")
                .addClass("link")
                .attr("target", "_blank")
                .attr("href", "https://twitter.com/share?text=" + encodeURIComponent("I want to build a collective document and need your help: " + window.location.href.split('?')[0] + "?cd=" + base.identifier))
                .text("help you create this collective document.")
                .appendTo($details1);

            var $details2 = $("<p />")
                .html("<strong>Second:</strong> Pick a sentence or two to replicate.")
                .appendTo($instructions);

            var $details3 = $("<p />")
                .html("A link to this recipe: ")
                .appendTo($instructions);

            var $helpLink = $("<a />")
                .addClass("link")
                .attr("target", "_blank")
                .attr("href", window.location.href.split('?')[0] + "?cd=" + base.identifier)
                .text(window.location.href.split('?')[0] + "?cd=" + base.identifier)
                .appendTo($details3);

                

            var $tweets = $("<div />")
                .addClass("tweets")
                .appendTo(base.$el);

            for(var x in base.tweets) {
                var $container = $("<div />")
                    .addClass("tweet")
                    .appendTo($tweets);

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

            var $dmca = $("<div />")
                .addClass("dmca")
                .text("for DMCA takedown requests please contact Dan Schultz at slifty@gmail.com")
                .appendTo(base.$el);

            $.ajax({
                url:"store.php",
                method: "POST",
                data: {
                    t: base.$el.html(),
                    cd: base.identifier
                }
            })
        }

        // Run initializer
        base.init();
    };

    $.replicator.defaultOptions = {
        break_chars: ".?!",
        document_id: '',
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