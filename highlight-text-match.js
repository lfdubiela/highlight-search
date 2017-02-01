function searchHighLight(selectorInput, selectorContent, selectorNext, selectorPrior) {
    this.term = '';
    this.selectorInput   = selectorInput   || "*[input-highlight-text]";
    this.selectorContent = selectorContent || "*[content-highlight-text]";
    this.selectorNext    = selectorNext    || "*[next-highlight-text]";
    this.selectorPrior   = selectorPrior   || "*[prior-highlight-text]";
    this.matches = [];

    this.searchText = function(searchTerm) {;
        this.initVariable();
        this.term = searchTerm
        this.callHighlightText(this.term);
        if (this.getSelectorMatches().length > 0) {
            this.selectFirstMatch();
            return true;
        }
        return false;
    }

    this.callHighlightText = function(searchTerm) {
        $(this.selectorContent)
            .highlightRegex(searchTerm, {className: 'match'});
    }

    this.selectFirstMatch = function() {
        console.log();
        this.getSelectorMatches()
            .first().addClass('highlighted');
    }

    this.initVariable = function() {
        this.indexCounter = 0;
        this.matches = [];
    }

    this.initSearch = function() {
        this.testJquery();
        this.registerListeners();
    }

    this.getSelectorMatches = function() {
        if (this.matches.length > 0) {
            return this.matches;
        }
        return this.matches = $(this.selectorContent).find('.match');
    }

    this.cleanPreviousSearch = function(searchTerm) {
        if (searchTerm != this.term) {
            var $span = $(this.selectorContent).find('span.match');
            $span.replaceWith($span.html());
        }
    }

    this.testJquery = function() {
        if (typeof jQuery == 'undefined') {
            throw "Jquery is not defined";
        }

        if (typeof jQuery().highlightRegex == 'undefined') {
            throw "jQuery Highlight Regex Plugin is not defined, this plugin needs version v0.1.2.";
        }
    }

    this.jumpToNextOcurrence = function() {
        if (this.indexCounter >= this.getSelectorMatches().length) this.indexCounter = 0;
        this.matches.removeClass('highlighted');
        this.matches.eq(this.indexCounter).addClass('highlighted');
        $('body, .ui-mobile-viewport').animate({
            scrollTop: this.getSelectorMatches().eq(this.indexCounter).offset().top - 200
        }, 300);
        this.indexCounter++;
    }

    this.jumpToPreviousOcurrence = function() {
        this.indexCounter--;
        if (this.indexCounter >= this.getSelectorMatches().length) this.indexCounter = 0;
        this.matches.removeClass('highlighted');
        this.matches.eq(this.indexCounter).addClass('highlighted');
        $('body, .ui-mobile-viewport').animate({
            scrollTop: this.getSelectorMatches().eq(this.indexCounter).offset().top - 200
        }, 300);
    }

    this.dispatchSearch = function() {
        var searchTerm = $(this.selectorInput).val();
        this.cleanPreviousSearch(searchTerm);
        if (searchTerm && this.term != searchTerm) {
            this.searchText(searchTerm);
        }
    }

    this.registerDispatcherSearch = function() {
        var self = this;
        $(document).on('keyup', this.selectorInput, function(event) {
            if (event.which === 13) {
                if (self.matches.length > 0) {
                    self.jumpToNextOcurrence();
                }
            } else {
                self.dispatchSearch();
            }
        });
    }

    this.registerListeners = function () {
        $(this.selectorNext).off('click').on('click', this.jumpToNextOcurrence);
        $(this.selectorPrior).off('click').on('click', this.jumpToPreviousOcurrence);
        this.registerDispatcherSearch();
    }

    this.initSearch();
}

(function() {
    new searchHighLight();
})();