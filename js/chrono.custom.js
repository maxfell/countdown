(function () {
    function padToken(e, t) {
        return function (n) {
            return leftZeroFill(e.call(this, n), t)
        }
    }

    function ordinalizeToken(e, t) {
        return function (n) {
            return this.lang().ordinal(e.call(this, n), t)
        }
    }

    function Language() {}

    function Moment(e) {
        extend(this, e)
    }

    function Duration(e) {
        var t = this._data = {}, n = e.years || e.year || e.y || 0,
            r = e.months || e.month || e.M || 0,
            i = e.weeks || e.week || e.w || 0,
            s = e.days || e.day || e.d || 0,
            o = e.hours || e.hour || e.h || 0,
            u = e.minutes || e.minute || e.m || 0,
            a = e.seconds || e.second || e.s || 0,
            f = e.milliseconds || e.millisecond || e.ms || 0;
        this._milliseconds = f + a * 1e3 + u * 6e4 + o * 36e5, this._days = s + i * 7, this._months = r + n * 12, t.milliseconds = f % 1e3, a += absRound(f / 1e3), t.seconds = a % 60, u += absRound(a / 60), t.minutes = u % 60, o += absRound(u / 60), t.hours = o % 24, s += absRound(o / 24), s += i * 7, t.days = s % 30, r += absRound(s / 30), t.months = r % 12, n += absRound(r / 12), t.years = n
    }

    function extend(e, t) {
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
        return e
    }

    function absRound(e) {
        return e < 0 ? Math.ceil(e) : Math.floor(e)
    }

    function leftZeroFill(e, t) {
        var n = e + "";
        while (n.length < t) n = "0" + n;
        return n
    }

    function addOrSubtractDurationFromMoment(e, t, n, r) {
        var i = t._milliseconds,
            s = t._days,
            o = t._months,
            u, a, f;
        i && e._d.setTime(+e._d + i * n);
        if (s || o) u = e.minute(), a = e.hour();
        s && e.date(e.date() + s * n), o && (f = e.date(), e.date(1).month(e.month() + o * n).date(Math.min(f, e.daysInMonth()))), i && !r && moment.updateOffset(e);
        if (s || o) e.minute(u), e.hour(a)
    }

    function isArray(e) {
        return Object.prototype.toString.call(e) === "[object Array]"
    }

    function compareArrays(e, t) {
        var n = Math.min(e.length, t.length),
            r = Math.abs(e.length - t.length),
            i = 0,
            s;
        for (s = 0; s < n; s++)~~ e[s] !== ~~t[s] && i++;
        return i + r
    }

    function normalizeUnits(e) {
        return e ? unitAliases[e] || e.toLowerCase().replace(/(.)s$/, "$1") : e
    }

    function loadLang(e, t) {
        return t.abbr = e, languages[e] || (languages[e] = new Language), languages[e].set(t), languages[e]
    }

    function getLangDefinition(e) {
        return e ? (!languages[e] && hasModule && require("./lang/" + e), languages[e]) : moment.fn._lang
    }

    function removeFormattingTokens(e) {
        return e.match(/\[.*\]/) ? e.replace(/^\[|\]$/g, "") : e.replace(/\\/g, "")
    }

    function makeFormatFunction(e) {
        var t = e.match(formattingTokens),
            n, r;
        for (n = 0, r = t.length; n < r; n++) formatTokenFunctions[t[n]] ? t[n] = formatTokenFunctions[t[n]] : t[n] = removeFormattingTokens(t[n]);
        return function (s) {
            var o = "";
            for (n = 0; n < r; n++) o += t[n] instanceof Function ? t[n].call(s, e) : t[n];
            return o
        }
    }

    function formatMoment(e, t) {
        function r(t) {
            return e.lang().longDateFormat(t) || t
        }
        var n = 5;
        while (n-- && localFormattingTokens.test(t)) t = t.replace(localFormattingTokens, r);
        return formatFunctions[t] || (formatFunctions[t] = makeFormatFunction(t)), formatFunctions[t](e)
    }

    function getParseRegexForToken(e, t) {
        switch (e) {
        case "DDDD":
            return parseTokenThreeDigits;
        case "YYYY":
            return parseTokenFourDigits;
        case "YYYYY":
            return parseTokenSixDigits;
        case "S":
        case "SS":
        case "SSS":
        case "DDD":
            return parseTokenOneToThreeDigits;
        case "MMM":
        case "MMMM":
        case "dd":
        case "ddd":
        case "dddd":
            return parseTokenWord;
        case "a":
        case "A":
            return getLangDefinition(t._l)._meridiemParse;
        case "X":
            return parseTokenTimestampMs;
        case "Z":
        case "ZZ":
            return parseTokenTimezone;
        case "T":
            return parseTokenT;
        case "MM":
        case "DD":
        case "YY":
        case "HH":
        case "hh":
        case "mm":
        case "ss":
        case "M":
        case "D":
        case "d":
        case "H":
        case "h":
        case "m":
        case "s":
            return parseTokenOneOrTwoDigits;
        default:
            return new RegExp(e.replace("\\", ""))
        }
    }

    function timezoneMinutesFromString(e) {
        var t = (parseTokenTimezone.exec(e) || [])[0],
            n = (t + "").match(parseTimezoneChunker) || ["-", 0, 0],
            r = +(n[1] * 60) + ~~n[2];
        return n[0] === "+" ? -r : r
    }

    function addTimeToArrayFromToken(e, t, n) {
        var r, i, s = n._a;
        switch (e) {
        case "M":
        case "MM":
            s[1] = t == null ? 0 : ~~t - 1;
            break;
        case "MMM":
        case "MMMM":
            r = getLangDefinition(n._l).monthsParse(t), r != null ? s[1] = r : n._isValid = !1;
            break;
        case "D":
        case "DD":
        case "DDD":
        case "DDDD":
            t != null && (s[2] = ~~t);
            break;
        case "YY":
            s[0] = ~~t + (~~t > 68 ? 1900 : 2e3);
            break;
        case "YYYY":
        case "YYYYY":
            s[0] = ~~t;
            break;
        case "a":
        case "A":
            n._isPm = getLangDefinition(n._l).isPM(t);
            break;
        case "H":
        case "HH":
        case "h":
        case "hh":
            s[3] = ~~t;
            break;
        case "m":
        case "mm":
            s[4] = ~~t;
            break;
        case "s":
        case "ss":
            s[5] = ~~t;
            break;
        case "S":
        case "SS":
        case "SSS":
            s[6] = ~~ (("0." + t) * 1e3);
            break;
        case "X":
            n._d = new Date(parseFloat(t) * 1e3);
            break;
        case "Z":
        case "ZZ":
            n._useUTC = !0, n._tzm = timezoneMinutesFromString(t)
        }
        t == null && (n._isValid = !1)
    }

    function dateFromArray(e) {
        var t, n, r = [];
        if (e._d) return;
        for (t = 0; t < 7; t++) e._a[t] = r[t] = e._a[t] == null ? t === 2 ? 1 : 0 : e._a[t];
        r[3] += ~~((e._tzm || 0) / 60), r[4] += ~~((e._tzm || 0) % 60), n = new Date(0), e._useUTC ? (n.setUTCFullYear(r[0], r[1], r[2]), n.setUTCHours(r[3], r[4], r[5], r[6])) : (n.setFullYear(r[0], r[1], r[2]), n.setHours(r[3], r[4], r[5], r[6])), e._d = n
    }

    function makeDateFromStringAndFormat(e) {
        var t = e._f.match(formattingTokens),
            n = e._i,
            r, i;
        e._a = [];
        for (r = 0; r < t.length; r++) i = (getParseRegexForToken(t[r], e).exec(n) || [])[0], i && (n = n.slice(n.indexOf(i) + i.length)), formatTokenFunctions[t[r]] && addTimeToArrayFromToken(t[r], i, e);
        n && (e._il = n), e._isPm && e._a[3] < 12 && (e._a[3] += 12), e._isPm === !1 && e._a[3] === 12 && (e._a[3] = 0), dateFromArray(e)
    }

    function makeDateFromStringAndArray(e) {
        var t, n, r, i = 99,
            s, o;
        for (s = 0; s < e._f.length; s++) t = extend({}, e), t._f = e._f[s], makeDateFromStringAndFormat(t), n = new Moment(t), o = compareArrays(t._a, n.toArray()), n._il && (o += n._il.length), o < i && (i = o, r = n);
        extend(e, r)
    }

    function makeDateFromString(e) {
        var t, n = e._i,
            r = isoRegex.exec(n);
        if (r) {
            e._f = "YYYY-MM-DD" + (r[2] || " ");
            for (t = 0; t < 4; t++)
                if (isoTimes[t][1].exec(n)) {
                    e._f += isoTimes[t][0];
                    break
                }
            parseTokenTimezone.exec(n) && (e._f += " Z"), makeDateFromStringAndFormat(e)
        } else e._d = new Date(n)
    }

    function makeDateFromInput(e) {
        var t = e._i,
            n = aspNetJsonRegex.exec(t);
        t === undefined ? e._d = new Date : n ? e._d = new Date(+n[1]) : typeof t == "string" ? makeDateFromString(e) : isArray(t) ? (e._a = t.slice(0), dateFromArray(e)) : e._d = t instanceof Date ? new Date(+t) : new Date(t)
    }

    function substituteTimeAgo(e, t, n, r, i) {
        return i.relativeTime(t || 1, !! n, e, r)
    }

    function relativeTime(e, t, n) {
        var r = round(Math.abs(e) / 1e3),
            i = round(r / 60),
            s = round(i / 60),
            o = round(s / 24),
            u = round(o / 365),
            a = r < 45 && ["s", r] || i === 1 && ["m"] || i < 45 && ["mm", i] || s === 1 && ["h"] || s < 22 && ["hh", s] || o === 1 && ["d"] || o <= 25 && ["dd", o] || o <= 45 && ["M"] || o < 345 && ["MM", round(o / 30)] || u === 1 && ["y"] || ["yy", u];
        return a[2] = t, a[3] = e > 0, a[4] = n, substituteTimeAgo.apply({}, a)
    }

    function weekOfYear(e, t, n) {
        var r = n - t,
            i = n - e.day(),
            s;
        return i > r && (i -= 7), i < r - 7 && (i += 7), s = moment(e).add("d", i), {
            week: Math.ceil(s.dayOfYear() / 7),
            year: s.year()
        }
    }

    function makeMoment(e) {
        var t = e._i,
            n = e._f;
        return t === null || t === "" ? null : (typeof t == "string" && (e._i = t = getLangDefinition().preparse(t)), moment.isMoment(t) ? (e = extend({}, t), e._d = new Date(+t._d)) : n ? isArray(n) ? makeDateFromStringAndArray(e) : makeDateFromStringAndFormat(e) : makeDateFromInput(e), new Moment(e))
    }

    function makeGetterAndSetter(e, t) {
        moment.fn[e] = moment.fn[e + "s"] = function (e) {
            var n = this._isUTC ? "UTC" : "";
            return e != null ? (this._d["set" + n + t](e), moment.updateOffset(this), this) : this._d["get" + n + t]()
        }
    }

    function makeDurationGetter(e) {
        moment.duration.fn[e] = function () {
            return this._data[e]
        }
    }

    function makeDurationAsGetter(e, t) {
        moment.duration.fn["as" + e] = function () {
            return +this / t
        }
    }
    var moment, VERSION = "2.0.0",
        round = Math.round,
        i, languages = {}, hasModule = typeof module != "undefined" && module.exports,
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(\d*)?\.?(\d+)\:(\d+)\:(\d+)\.?(\d{3})?/,
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,
        parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,
        parseTokenOneOrTwoDigits = /\d\d?/,
        parseTokenOneToThreeDigits = /\d{1,3}/,
        parseTokenThreeDigits = /\d{3}/,
        parseTokenFourDigits = /\d{1,4}/,
        parseTokenSixDigits = /[+\-]?\d{1,6}/,
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i,
        parseTokenT = /T/i,
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/,
        isoRegex = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,
        isoFormat = "YYYY-MM-DDTHH:mm:ssZ",
        isoTimes = [
            ["HH:mm:ss.S", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
            ["HH:mm", /(T| )\d\d:\d\d/],
            ["HH", /(T| )\d\d/]
        ],
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,
        proxyGettersAndSetters = "Date|Hours|Minutes|Seconds|Milliseconds".split("|"),
        unitMillisecondFactors = {
            Milliseconds: 1,
            Seconds: 1e3,
            Minutes: 6e4,
            Hours: 36e5,
            Days: 864e5,
            Months: 2592e6,
            Years: 31536e6
        }, unitAliases = {
            ms: "millisecond",
            s: "second",
            m: "minute",
            h: "hour",
            d: "day",
            w: "week",
            M: "month",
            y: "year"
        }, formatFunctions = {}, ordinalizeTokens = "DDD w W M D d".split(" "),
        paddedTokens = "M D H h m s w W".split(" "),
        formatTokenFunctions = {
            M: function () {
                return this.month() + 1
            },
            MMM: function (e) {
                return this.lang().monthsShort(this, e)
            },
            MMMM: function (e) {
                return this.lang().months(this, e)
            },
            D: function () {
                return this.date()
            },
            DDD: function () {
                return this.dayOfYear()
            },
            d: function () {
                return this.day()
            },
            dd: function (e) {
                return this.lang().weekdaysMin(this, e)
            },
            ddd: function (e) {
                return this.lang().weekdaysShort(this, e)
            },
            dddd: function (e) {
                return this.lang().weekdays(this, e)
            },
            w: function () {
                return this.week()
            },
            W: function () {
                return this.isoWeek()
            },
            YY: function () {
                return leftZeroFill(this.year() % 100, 2)
            },
            YYYY: function () {
                return leftZeroFill(this.year(), 4)
            },
            YYYYY: function () {
                return leftZeroFill(this.year(), 5)
            },
            gg: function () {
                return leftZeroFill(this.weekYear() % 100, 2)
            },
            gggg: function () {
                return this.weekYear()
            },
            ggggg: function () {
                return leftZeroFill(this.weekYear(), 5)
            },
            GG: function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2)
            },
            GGGG: function () {
                return this.isoWeekYear()
            },
            GGGGG: function () {
                return leftZeroFill(this.isoWeekYear(), 5)
            },
            e: function () {
                return this.weekday()
            },
            E: function () {
                return this.isoWeekday()
            },
            a: function () {
                return this.lang().meridiem(this.hours(), this.minutes(), !0)
            },
            A: function () {
                return this.lang().meridiem(this.hours(), this.minutes(), !1)
            },
            H: function () {
                return this.hours()
            },
            h: function () {
                return this.hours() % 12 || 12
            },
            m: function () {
                return this.minutes()
            },
            s: function () {
                return this.seconds()
            },
            S: function () {
                return~~ (this.milliseconds() / 100)
            },
            SS: function () {
                return leftZeroFill(~~(this.milliseconds() / 10), 2)
            },
            SSS: function () {
                return leftZeroFill(this.milliseconds(), 3)
            },
            Z: function () {
                var e = -this.zone(),
                    t = "+";
                return e < 0 && (e = -e, t = "-"), t + leftZeroFill(~~(e / 60), 2) + ":" + leftZeroFill(~~e % 60, 2)
            },
            ZZ: function () {
                var e = -this.zone(),
                    t = "+";
                return e < 0 && (e = -e, t = "-"), t + leftZeroFill(~~(10 * e / 6), 4)
            },
            z: function () {
                return this.zoneAbbr()
            },
            zz: function () {
                return this.zoneName()
            },
            X: function () {
                return this.unix()
            }
        };
    while (ordinalizeTokens.length) i = ordinalizeTokens.pop(), formatTokenFunctions[i + "o"] = ordinalizeToken(formatTokenFunctions[i], i);
    while (paddedTokens.length) i = paddedTokens.pop(), formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3), Language.prototype = {
        set: function (e) {
            var t, n;
            for (n in e) t = e[n], typeof t == "function" ? this[n] = t : this["_" + n] = t
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function (e) {
            return this._months[e.month()]
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function (e) {
            return this._monthsShort[e.month()]
        },
        monthsParse: function (e) {
            var t, n, r;
            this._monthsParse || (this._monthsParse = []);
            for (t = 0; t < 12; t++) {
                this._monthsParse[t] || (n = moment([2e3, t]), r = "^" + this.months(n, "") + "|^" + this.monthsShort(n, ""), this._monthsParse[t] = new RegExp(r.replace(".", ""), "i"));
                if (this._monthsParse[t].test(e)) return t
            }
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function (e) {
            return this._weekdays[e.day()]
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function (e) {
            return this._weekdaysShort[e.day()]
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function (e) {
            return this._weekdaysMin[e.day()]
        },
        weekdaysParse: function (e) {
            var t, n, r;
            this._weekdaysParse || (this._weekdaysParse = []);
            for (t = 0; t < 7; t++) {
                this._weekdaysParse[t] || (n = moment([2e3, 1]).day(t), r = "^" + this.weekdays(n, "") + "|^" + this.weekdaysShort(n, "") + "|^" + this.weekdaysMin(n, ""), this._weekdaysParse[t] = new RegExp(r.replace(".", ""), "i"));
                if (this._weekdaysParse[t].test(e)) return t
            }
        },
        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        longDateFormat: function (e) {
            var t = this._longDateFormat[e];
            return !t && this._longDateFormat[e.toUpperCase()] && (t = this._longDateFormat[e.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (e) {
                return e.slice(1)
            }), this._longDateFormat[e] = t), t
        },
        isPM: function (e) {
            return (e + "").toLowerCase()[0] === "p"
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function (e, t, n) {
            return e > 11 ? n ? "pm" : "PM" : n ? "am" : "AM"
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function (e, t) {
            var n = this._calendar[e];
            return typeof n == "function" ? n.apply(t) : n
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function (e, t, n, r) {
            var i = this._relativeTime[n];
            return typeof i == "function" ? i(e, t, n, r) : i.replace(/%d/i, e)
        },
        pastFuture: function (e, t) {
            var n = this._relativeTime[e > 0 ? "future" : "past"];
            return typeof n == "function" ? n(t) : n.replace(/%s/i, t)
        },
        ordinal: function (e) {
            return this._ordinal.replace("%d", e)
        },
        _ordinal: "%d",
        preparse: function (e) {
            return e
        },
        postformat: function (e) {
            return e
        },
        week: function (e) {
            return weekOfYear(e, this._week.dow, this._week.doy).week
        },
        _week: {
            dow: 0,
            doy: 6
        }
    }, moment = function (e, t, n) {
        return makeMoment({
            _i: e,
            _f: t,
            _l: n,
            _isUTC: !1
        })
    }, moment.utc = function (e, t, n) {
        return makeMoment({
            _useUTC: !0,
            _isUTC: !0,
            _l: n,
            _i: e,
            _f: t
        })
    }, moment.unix = function (e) {
        return moment(e * 1e3)
    }, moment.duration = function (e, t) {
        var n = moment.isDuration(e),
            r = typeof e == "number",
            i = n ? e._data : r ? {} : e,
            s = aspNetTimeSpanJsonRegex.exec(e),
            o, u;
        return r ? t ? i[t] = e : i.milliseconds = e : s && (o = s[1] === "-" ? -1 : 1, i = {
            y: 0,
            d: ~~s[2] * o,
            h: ~~s[3] * o,
            m: ~~s[4] * o,
            s: ~~s[5] * o,
            ms: ~~s[6] * o
        }), u = new Duration(i), n && e.hasOwnProperty("_lang") && (u._lang = e._lang), u
    }, moment.version = VERSION, moment.defaultFormat = isoFormat, moment.updateOffset = function () {}, moment.lang = function (e, t) {
        var n;
        if (!e) return moment.fn._lang._abbr;
        t ? loadLang(e, t) : languages[e] || getLangDefinition(e), moment.duration.fn._lang = moment.fn._lang = getLangDefinition(e)
    }, moment.langData = function (e) {
        return e && e._lang && e._lang._abbr && (e = e._lang._abbr), getLangDefinition(e)
    }, moment.isMoment = function (e) {
        return e instanceof Moment
    }, moment.isDuration = function (e) {
        return e instanceof Duration
    }, moment.fn = Moment.prototype = {
        clone: function () {
            return moment(this)
        },
        valueOf: function () {
            return +this._d + (this._offset || 0) * 6e4
        },
        unix: function () {
            return Math.floor(+this / 1e3)
        },
        toString: function () {
            return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        },
        toDate: function () {
            return this._offset ? new Date(+this) : this._d
        },
        toISOString: function () {
            return formatMoment(moment(this).utc(), "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        },
        toArray: function () {
            var e = this;
            return [e.year(), e.month(), e.date(), e.hours(), e.minutes(), e.seconds(), e.milliseconds()]
        },
        isValid: function () {
            return this._isValid == null && (this._a ? this._isValid = !compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) : this._isValid = !isNaN(this._d.getTime())), !! this._isValid
        },
        utc: function () {
            return this.zone(0)
        },
        local: function () {
            return this.zone(0), this._isUTC = !1, this
        },
        format: function (e) {
            var t = formatMoment(this, e || moment.defaultFormat);
            return this.lang().postformat(t)
        },
        add: function (e, t) {
            var n;
            return typeof e == "string" ? n = moment.duration(+t, e) : n = moment.duration(e, t), addOrSubtractDurationFromMoment(this, n, 1), this
        },
        subtract: function (e, t) {
            var n;
            return typeof e == "string" ? n = moment.duration(+t, e) : n = moment.duration(e, t), addOrSubtractDurationFromMoment(this, n, -1), this
        },
        diff: function (e, t, n) {
            var r = this._isUTC ? moment(e).zone(this._offset || 0) : moment(e).local(),
                i = (this.zone() - r.zone()) * 6e4,
                s, o;
            return t = normalizeUnits(t), t === "year" || t === "month" ? (s = (this.daysInMonth() + r.daysInMonth()) * 432e5, o = (this.year() - r.year()) * 12 + (this.month() - r.month()), o += (this - moment(this).startOf("month") - (r - moment(r).startOf("month"))) / s, t === "year" && (o /= 12)) : (s = this - r - i, o = t === "second" ? s / 1e3 : t === "minute" ? s / 6e4 : t === "hour" ? s / 36e5 : t === "day" ? s / 864e5 : t === "week" ? s / 6048e5 : s), n ? o : absRound(o)
        },
        from: function (e, t) {
            return moment.duration(this.diff(e)).lang(this.lang()._abbr).humanize(!t)
        },
        fromNow: function (e) {
            return this.from(moment(), e)
        },
        calendar: function () {
            var e = this.diff(moment().startOf("day"), "days", !0),
                t = e < -6 ? "sameElse" : e < -1 ? "lastWeek" : e < 0 ? "lastDay" : e < 1 ? "sameDay" : e < 2 ? "nextDay" : e < 7 ? "nextWeek" : "sameElse";
            return this.format(this.lang().calendar(t, this))
        },
        isLeapYear: function () {
            var e = this.year();
            return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0
        },
        isDST: function () {
            return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone()
        },
        day: function (e) {
            var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (e != null) {
                if (typeof e == "string") {
                    e = this.lang().weekdaysParse(e);
                    if (typeof e != "number") return this
                }
                return this.add({
                    d: e - t
                })
            }
            return t
        },
        month: function (e) {
            var t = this._isUTC ? "UTC" : "";
            if (e != null) {
                if (typeof e == "string") {
                    e = this.lang().monthsParse(e);
                    if (typeof e != "number") return this
                }
                return this._d["set" + t + "Month"](e), moment.updateOffset(this), this
            }
            return this._d["get" + t + "Month"]()
        },
        startOf: function (e) {
            e = normalizeUnits(e);
            switch (e) {
            case "year":
                this.month(0);
            case "month":
                this.date(1);
            case "week":
            case "day":
                this.hours(0);
            case "hour":
                this.minutes(0);
            case "minute":
                this.seconds(0);
            case "second":
                this.milliseconds(0)
            }
            return e === "week" && this.weekday(0), this
        },
        endOf: function (e) {
            return this.startOf(e).add(e, 1).subtract("ms", 1)
        },
        isAfter: function (e, t) {
            return t = typeof t != "undefined" ? t : "millisecond", +this.clone().startOf(t) > +moment(e).startOf(t)
        },
        isBefore: function (e, t) {
            return t = typeof t != "undefined" ? t : "millisecond", +this.clone().startOf(t) < +moment(e).startOf(t)
        },
        isSame: function (e, t) {
            return t = typeof t != "undefined" ? t : "millisecond", +this.clone().startOf(t) === +moment(e).startOf(t)
        },
        min: function (e) {
            return e = moment.apply(null, arguments), e < this ? this : e
        },
        max: function (e) {
            return e = moment.apply(null, arguments), e > this ? this : e
        },
        zone: function (e) {
            var t = this._offset || 0;
            return e == null ? this._isUTC ? t : this._d.getTimezoneOffset() : (typeof e == "string" && (e = timezoneMinutesFromString(e)), Math.abs(e) < 16 && (e *= 60), this._offset = e, this._isUTC = !0, t !== e && addOrSubtractDurationFromMoment(this, moment.duration(t - e, "m"), 1, !0), this)
        },
        zoneAbbr: function () {
            return this._isUTC ? "UTC" : ""
        },
        zoneName: function () {
            return this._isUTC ? "Coordinated Universal Time" : ""
        },
        daysInMonth: function () {
            return moment.utc([this.year(), this.month() + 1, 0]).date()
        },
        dayOfYear: function (e) {
            var t = round((moment(this).startOf("day") - moment(this).startOf("year")) / 864e5) + 1;
            return e == null ? t : this.add("d", e - t)
        },
        weekYear: function (e) {
            var t = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return e == null ? t : this.add("y", e - t)
        },
        isoWeekYear: function (e) {
            var t = weekOfYear(this, 1, 4).year;
            return e == null ? t : this.add("y", e - t)
        },
        week: function (e) {
            var t = this.lang().week(this);
            return e == null ? t : this.add("d", (e - t) * 7)
        },
        isoWeek: function (e) {
            var t = weekOfYear(this, 1, 4).week;
            return e == null ? t : this.add("d", (e - t) * 7)
        },
        weekday: function (e) {
            var t = (this._d.getDay() + 7 - this.lang()._week.dow) % 7;
            return e == null ? t : this.add("d", e - t)
        },
        isoWeekday: function (e) {
            var t = (this._d.getDay() + 6) % 7;
            return e == null ? t : this.add("d", e - t)
        },
        lang: function (e) {
            return e === undefined ? this._lang : (this._lang = getLangDefinition(e), this)
        }
    };
    for (i = 0; i < proxyGettersAndSetters.length; i++) makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ""), proxyGettersAndSetters[i]);
    makeGetterAndSetter("year", "FullYear"), moment.fn.days = moment.fn.day, moment.fn.months = moment.fn.month, moment.fn.weeks = moment.fn.week, moment.fn.isoWeeks = moment.fn.isoWeek, moment.fn.toJSON = moment.fn.toISOString, moment.duration.fn = Duration.prototype = {
        weeks: function () {
            return absRound(this.days() / 7)
        },
        valueOf: function () {
            return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + ~~(this._months / 12) * 31536e6
        },
        humanize: function (e) {
            var t = +this,
                n = relativeTime(t, !e, this.lang());
            return e && (n = this.lang().pastFuture(t, n)), this.lang().postformat(n)
        },
        add: function (e, t) {
            var n = moment.duration(e, t);
            return this._milliseconds += n._milliseconds, this._days += n._days, this._months += n._months, this
        },
        subtract: function (e, t) {
            var n = moment.duration(e, t);
            return this._milliseconds -= n._milliseconds, this._days -= n._days, this._months -= n._months, this
        },
        get: function (e) {
            return e = normalizeUnits(e), this[e.toLowerCase() + "s"]()
        },
        as: function (e) {
            return e = normalizeUnits(e), this["as" + e.charAt(0).toUpperCase() + e.slice(1) + "s"]()
        },
        lang: moment.fn.lang
    };
    for (i in unitMillisecondFactors) unitMillisecondFactors.hasOwnProperty(i) && (makeDurationAsGetter(i, unitMillisecondFactors[i]), makeDurationGetter(i.toLowerCase()));
    makeDurationAsGetter("Weeks", 6048e5), moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12
    }, moment.lang("en", {
        ordinal: function (e) {
            var t = e % 10,
                n = ~~ (e % 100 / 10) === 1 ? "th" : t === 1 ? "st" : t === 2 ? "nd" : t === 3 ? "rd" : "th";
            return e + n
        }
    }), hasModule && (module.exports = moment),
    function () {
        var chrono = {};
        chrono.parsers = {}, chrono.refiners = {}, chrono.parse = function (e, t) {
            var n = this.integratedParse(e, t),
                n = this.integratedRefine(e, n);
            return n
        }, chrono.parseDate = function (e, t, n) {
            var r = this.parse(e, t);
            return r.length >= 1 ? r[0].start.date(n) : null
        };
        if (typeof exports == "undefined") {
            var moment = moment || window.moment;
            window.chrono = chrono
        } else {
            var fs = require("fs"),
                moment = require("./moment");

            function loadModuleDirs(dir) {
                var module_dirs = fs.readdirSync(__dirname + "/" + dir);
                module_dirs = module_dirs.filter(function (e) {
                    return !e.match(/\./)
                });
                for (var i in module_dirs) {
                    var dirname = module_dirs[i];
                    if (typeof dirname == "function") continue;
                    var parser_files = fs.readdirSync(__dirname + "/" + dir + "/" + dirname);
                    for (var j in parser_files) {
                        var filename = parser_files[j];
                        if (typeof filename == "function") continue;
                        if (!filename.match(/\.js$/)) continue;
                        eval(fs.readFileSync(__dirname + "/" + dir + "/" + dirname + "/" + filename) + "")
                    }
                }
            }
            eval(fs.readFileSync(__dirname + "/timezone.js") + ""), eval(fs.readFileSync(__dirname + "/parsers/ParseResult.js") + ""), eval(fs.readFileSync(__dirname + "/parsers/Parser.js") + ""), eval(fs.readFileSync(__dirname + "/parsers/IntegratedParsing.js") + ""), loadModuleDirs("parsers"), eval(fs.readFileSync(__dirname + "/refiners/IntegratedRefinement.js") + ""), loadModuleDirs("refiners"), module.exports = chrono
        }
    }(),
    function () {
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        chrono.timezoneMap = {
            A: 60,
            ACDT: 630,
            ACST: 570,
            ADT: -180,
            AEDT: 660,
            AEST: 600,
            AFT: 270,
            AKDT: -480,
            AKST: -540,
            ALMT: 360,
            AMST: -180,
            AMT: -240,
            ANAST: 720,
            ANAT: 720,
            AQTT: 300,
            ART: -180,
            AST: -240,
            AWDT: 540,
            AWST: 480,
            AZOST: 0,
            AZOT: -60,
            AZST: 300,
            AZT: 240,
            B: 120,
            BNT: 480,
            BOT: -240,
            BRST: -120,
            BRT: -180,
            BST: 60,
            BTT: 360,
            C: 180,
            CAST: 480,
            CAT: 120,
            CCT: 390,
            CDT: -300,
            CEST: 120,
            CET: 60,
            CHADT: 825,
            CHAST: 765,
            CKT: -600,
            CLST: -180,
            CLT: -240,
            COT: -300,
            CST: -360,
            CVT: -60,
            CXT: 420,
            ChST: 600,
            D: 240,
            DAVT: 420,
            E: 300,
            EASST: -300,
            EAST: -360,
            EAT: 180,
            ECT: -300,
            EDT: -240,
            EEST: 180,
            EET: 120,
            EGST: 0,
            EGT: -60,
            EST: -300,
            ET: -300,
            F: 360,
            FJST: 780,
            FJT: 720,
            FKST: -180,
            FKT: -240,
            FNT: -120,
            G: 420,
            GALT: -360,
            GAMT: -540,
            GET: 240,
            GFT: -180,
            GILT: 720,
            GMT: 0,
            GST: 240,
            GYT: -240,
            H: 480,
            HAA: -180,
            HAC: -300,
            HADT: -540,
            HAE: -240,
            HAP: -420,
            HAR: -360,
            HAST: -600,
            HAT: -90,
            HAY: -480,
            HKT: 480,
            HLV: -210,
            HNA: -240,
            HNC: -360,
            HNE: -300,
            HNP: -480,
            HNR: -420,
            HNT: -150,
            HNY: -540,
            HOVT: 420,
            I: 540,
            ICT: 420,
            IDT: 180,
            IOT: 360,
            IRDT: 270,
            IRKST: 540,
            IRKT: 540,
            IRST: 210,
            IST: 60,
            JST: 540,
            K: 600,
            KGT: 360,
            KRAST: 480,
            KRAT: 480,
            KST: 540,
            KUYT: 240,
            L: 660,
            LHDT: 660,
            LHST: 630,
            LINT: 840,
            M: 720,
            MAGST: 720,
            MAGT: 720,
            MART: -510,
            MAWT: 300,
            MDT: -360,
            MESZ: 120,
            MEZ: 60,
            MHT: 720,
            MMT: 390,
            MSD: 240,
            MSK: 240,
            MST: -420,
            MUT: 240,
            MVT: 300,
            MYT: 480,
            N: -60,
            NCT: 660,
            NDT: -90,
            NFT: 690,
            NOVST: 420,
            NOVT: 360,
            NPT: 345,
            NST: -150,
            NUT: -660,
            NZDT: 780,
            NZST: 720,
            O: -120,
            OMSST: 420,
            OMST: 420,
            P: -180,
            PDT: -420,
            PET: -300,
            PETST: 720,
            PETT: 720,
            PGT: 600,
            PHOT: 780,
            PHT: 480,
            PKT: 300,
            PMDT: -120,
            PMST: -180,
            PONT: 660,
            PST: -480,
            PT: -480,
            PWT: 540,
            PYST: -180,
            PYT: -240,
            Q: -240,
            R: -300,
            RET: 240,
            S: -360,
            SAMT: 240,
            SAST: 120,
            SBT: 660,
            SCT: 240,
            SGT: 480,
            SRT: -180,
            SST: -660,
            T: -420,
            TAHT: -600,
            TFT: 300,
            TJT: 300,
            TKT: 780,
            TLT: 540,
            TMT: 300,
            TVT: 720,
            U: -480,
            ULAT: 480,
            UTC: 0,
            UYST: -120,
            UYT: -180,
            UZT: 300,
            V: -540,
            VET: -210,
            VLAST: 660,
            VLAT: 660,
            VUT: 660,
            W: -600,
            WAST: 120,
            WAT: 60,
            WEST: 60,
            WESZ: 60,
            WET: 0,
            WEZ: 0,
            WFT: 720,
            WGST: -120,
            WGT: -180,
            WIB: 420,
            WIT: 540,
            WITA: 480,
            WST: 780,
            WT: 0,
            X: -660,
            Y: -720,
            YAKST: 600,
            YAKT: 600,
            YAPT: 600,
            YEKST: 360,
            YEKT: 360,
            Z: 0
        }
    }(),
    function () {
        function e(e) {
            this.year = e.year, this.month = e.month, this.day = e.day, this.hour = e.hour, this.minute = e.minute, this.second = e.second, this.timezoneOffset = e.timezoneOffset, this.dayOfWeek = e.dayOfWeek, e.meridiem && (this.meridiem = e.meridiem.toLowerCase()), e.impliedComponents && e.impliedComponents.length > 0 && (this.impliedComponents = e.impliedComponents), this.isCertain = function (e) {
                return this[e] !== undefined && this[e] !== null && (this.impliedComponents ? this.impliedComponents.indexOf(e) < 0 : !0)
            }, this.date = function (e) {
                if (this.timezoneOffset === undefined || this.timezoneOffset === null) {
                    if (e === undefined || e === null) e = (new Date).getTimezoneOffset()
                } else e = this.timezoneOffset;
                var t = moment(new Date(this.year, this.month, this.day));
                return this.hour === undefined || this.hour === null ? t.hours(12) : t.hours(this.hour), t.minutes(this.minute), t.seconds(this.second), t.add("minutes", e - (new Date).getTimezoneOffset()), t.toDate()
            }
        }

        function t(t) {
            this.start = new e(t.start), this.startDate = this.start.date(), t.end && (this.end = new e(t.end), this.endDate = this.end.date()), this.referenceDate = t.referenceDate, this.index = t.index, this.text = t.text, this.concordance = t.concordance, t.timezoneOffset && (this.timezoneOffset = t.timezoneOffset)
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        chrono.DateComponents = e, chrono.ParseResult = t
    }(),
    function () {
        function e(e, t, n) {
            var r = 0,
                i = e,
                s = !1,
                o = [],
                u = {};
            return u.pattern = function () {
                return /./i
            }, u.extract = function (e, t) {
                return null
            }, u.results = function () {
                return o
            }, u.finished = function () {
                return s
            }, u.mergeOverlapResult = function (e, t, n) {
                if (n.index < t.index) {
                    var r = t;
                    t = n, n = r
                }
                var i = t.index + t.text.length,
                    s = n.index;
                if (s < i && t.index < n.index && i < n.index + n.text.length) {
                    var o = t.index,
                        u = e.substring(t.index, n.index + n.text.length),
                        a = t.start.impliedComponents || [],
                        f = n.start.impliedComponents || [];
                    if (a.length < f.length) {
                        var r = t;
                        t = n, n = r, a = t.start.impliedComponents || [], f = n.start.impliedComponents || []
                    }
                    if (a.indexOf("day") < 0 || a.indexOf("month") < 0 || a.indexOf("year") < 0) return;
                    return new chrono.ParseResult({
                        referenceDate: t.ref,
                        index: o,
                        start: n.start,
                        end: n.end,
                        text: u,
                        referenceDate: t.referenceDate
                    })
                }
                var l = e.substring(i, s),
                    c = /^\s*(to|\-)\s*$/i;
                if (!l.match(c)) return null;
                var u = t.text + l + n.text,
                    h = new Object(t.start),
                    p = new Object(n.start),
                    a = t.start.impliedComponents || [],
                    f = n.start.impliedComponents || [];
                return a.forEach(function (e) {
                    if (!p.impliedComponents || p.impliedComponents.indexOf(e) < 0) {
                        h[e] = p[e];
                        var t = h.impliedComponents.indexOf(e);
                        h.impliedComponents.splice(t, 1)
                    }
                }), f.forEach(function (e) {
                    if (!h.impliedComponents || h.impliedComponents.indexOf(e) < 0) {
                        p[e] = h[e];
                        var t = p.impliedComponents.indexOf(e);
                        p.impliedComponents.splice(t, 1)
                    }
                }), moment(p.date()).diff(moment(h.date())) > 0 ? new chrono.ParseResult({
                    referenceDate: t.ref,
                    index: t.index,
                    start: h,
                    end: p,
                    text: u,
                    referenceDate: t.referenceDate
                }) : new chrono.ParseResult({
                    referenceDate: t.ref,
                    index: t.index,
                    start: p,
                    end: h,
                    text: u,
                    referenceDate: t.referenceDate
                })
            }, u.extractTime = function (e, t) {
                var n = /^\s*,?\s*(at|from)?\s*,?\s*([0-9]{1,4}|noon|midnight)((\.|\:|\：)([0-9]{1,2})((\.|\:|\：)([0-9]{1,2}))?)?(\s*(AM|PM))?(\W|$)/i,
                    r = /^\s*(\-|\~|\〜|to|\?)\s*([0-9]{1,4})((\.|\:|\：)([0-9]{1,2})((\.|\:|\：)([0-9]{1,2}))?)?(\s*(AM|PM))?/i;
                if (e.length <= t.index + t.text.length) return null;
                e = e.substr(t.index + t.text.length);
                var i = e.match(n);
                if (!i) return null;
                var s = 0,
                    o = 0,
                    u = i[2];
                u.toLowerCase() == "noon" ? (t.start.meridiem = "pm", u = 12) : u.toLowerCase() == "midnight" ? (t.start.meridiem = "am", u = 0) : u = parseInt(u);
                if (i[5]) {
                    s = i[5], s = parseInt(s);
                    if (s >= 60) return null
                } else u > 100 && (s = u % 100, u = (u - s) / 100); if (i[8]) {
                    o = i[8], o = parseInt(o);
                    if (o >= 60) return null
                }
                if (i[10]) {
                    if (u > 12) return null;
                    i[10].toLowerCase() == "am" && u == 12 && (u = 0), i[10].toLowerCase() == "pm" && u != 12 && (u += 12), t.start.meridiem = i[10].toLowerCase()
                }
                u >= 12 && (t.start.meridiem = "pm");
                if (u > 24) return null;
                t.text = t.text + i[0].substr(0, i[0].length - i[11].length), t.start.hour == undefined && (t.start.hour = u, t.start.minute = s, t.start.second = o), e = e.substr(i[0].length - i[11].length);
                var i = e.match(r);
                if (!i) return t.end && t.end.hour == undefined && (t.end.hour = u, t.end.minute = s, t.end.second = o), new chrono.ParseResult(t);
                var s = 0,
                    o = 0,
                    u = i[2];
                u = parseInt(u);
                if (i[5]) {
                    s = i[5], s = parseInt(s);
                    if (s >= 60) return null
                } else u > 100 && (s = u % 100, u = (u - s) / 100); if (i[8]) {
                    o = i[8], o = parseInt(o);
                    if (o >= 60) return null
                }
                if (i[10]) {
                    if (u > 12) return null;
                    i[10].toLowerCase() == "am" && u == 12 && (u = 0, t.end || (t.end = new chrono.DateComponents(t.start)), t.end.day += 1), i[10].toLowerCase() == "pm" && u != 12 && (u += 12), t.start.meridiem || (i[10].toLowerCase() == "am" && t.start.hour == 12 && (t.start.hour = 0), i[10].toLowerCase() == "pm" && t.start.hour != 12 && (t.start.hour += 12), t.start.meridiem = i[10].toLowerCase(), t.start.impliedComponents = t.start.impliedComponents || [], t.start.impliedComponents.push("meridiem"))
                }
                return t.text = t.text + i[0], t.end ? (t.end.hour = u, t.end.minute = s, t.end.second = o) : (t.end = new chrono.DateComponents(t.start), t.end.hour = u, t.end.minute = s, t.end.second = o), i[10] && (t.end.meridiem = i[10].toLowerCase()), u >= 12 && (t.end.meridiem = "pm"), new chrono.ParseResult(t)
            }, u.extractTimezone = function (e, t) {
                var n = /^\s*(GMT|UTC)(\+|\-)(\d{1,2})(\d{2})/;
                if (e.length <= t.index + t.text.length) return null;
                e = e.substr(t.index + t.text.length);
                var r = e.match(n);
                if (r) {
                    var i = parseInt(r[3]) * 60 + parseInt(r[4]),
                        i = parseInt(r[2] + i) * -1;
                    t.end && (t.end.timezoneOffset = i), t.start.timezoneOffset = i, t.text += r[0], e = e.substr(r[0].length)
                }
                var n = /^\s*\(?([A-Z]{1,4})\)?(\W|$)/,
                    r = e.match(n);
                if (r && chrono.timezoneMap[r[1]] !== undefined) {
                    var s = r[1],
                        i = -chrono.timezoneMap[s];
                    t.start.timezoneOffset === undefined && (t.start.timezoneOffset = i, t.end && (t.end.timezoneOffset = i)), t.text += r[0].substring(0, r[0].length - r[2].length)
                }
                return t
            }, u.extractConcordance = function (e, t) {
                var n = 30;
                return preText = e.substr(0, t.index), preText = preText.replace(/(\r\n|\n|\r)/gm, " "), preText = preText.replace(/(\s+)/gm, " "), preText.length > n ? preText = "..." + preText.substr(preText.length - n + 3, n - 3) : preText = preText.substr(0, n), posText = e.substr(t.index + t.text.length), posText = posText.replace(/(\r\n|\n|\r)/gm, " "), posText = posText.replace(/(\s+)/gm, " "), posText.length > n ? posText = posText.substr(0, n - 3) + "..." : posText = posText.substr(0, n), t.concordance = preText + posText, new chrono.ParseResult(t)
            }, u.exec = function () {
                if (s) return null;
                var t = i.search(this.pattern());
                if (t < 0) return s = !0, null;
                var n = t + r,
                    u = this.extract(e, n);
                if (!u) return i = i.substr(t + 1), r = n + 1, null;
                if (o.length > 0) {
                    var a = o[o.length - 1],
                        f = this.mergeOverlapResult(e, a, u);
                    u = f || u
                }
                if (u.start.hour === undefined || u.end && u.end.hour === undefined) {
                    var l = this.extractTime(e, u);
                    u = l || u
                }
                if (u.start.timezoneOffset === undefined || u.end && u.end.timezoneOffset === undefined) {
                    var c = this.extractTimezone(e, u);
                    u = c || u
                }
                return this.extractConcordance(e, u), o.push(u), i = e.substr(u.index + u.text.length + 1), r = u.index + u.text.length + 1, u
            }, u.execAll = function () {
                while (!this.finished()) this.exec()
            }, u
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        chrono.Parser = e
    }(),
    function () {
        function e(e, n, r, i) {
            r = r || {}, n = n || new Date, i = i || Object.keys(chrono.parsers);
            var s = 0,
                o = [],
                u = [];
            for (var a = 0; a < i.length; a++) chrono.parsers[i[a]] && o.push(new chrono.parsers[i[a]](e, n, r));
            while (s < o.length) {
                var f = o[s];
                while (!f.finished()) {
                    var l = f.exec();
                    l && t(u, l)
                }
                s++
            }
            return u
        }

        function t(e, t) {
            var n = 0;
            while (n < e.length && e[n].index < t.index) n++;
            if (n < e.length) {
                var r = n;
                while (r < e.length && e[r].index < t.index + t.text.length) {
                    if (e[r].text.length >= t.text.length) return e;
                    r++
                }
                e.splice(n, r - n)
            }
            if (n - 1 >= 0) {
                var i = e[n - 1];
                if (t.index < i.index + i.text.length) {
                    if (i.text.length >= t.text.length) return e;
                    e.splice(n - 1, 1), n -= 1
                }
            }
            return e.splice(n, 0, t), e
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        chrono.integratedParse = e
    }(),
    function () {
        function e(e, t, n) {
            var r = /(\W|^)(the\s*)?([0-9]{1,2})(th|rd|nd|st)(\W|$)/i;
            n = n || {}, t = t || new Date;
            var i = chrono.Parser(e, t, n);
            return i.pattern = function () {
                return r
            }, i.extract = function (e, n) {
                var i = e.substr(n).match(r);
                if (e.substr(n - 1).search(r) == 0) return;
                if (i == null) {
                    finished = !0;
                    return
                }
                var e = i[0];
                e = i[0].substr(i[1].length, i[0].length - i[1].length - i[5].length), n += i[1].length;
                var s = i[3];
                s = parseInt(s);
                var o = moment(t);
                o.date(s);
                if (s > 31 || o.date() != s) return;
                return new chrono.ParseResult({
                    referenceDate: t,
                    text: e,
                    index: n,
                    start: {
                        day: o.date(),
                        month: o.month(),
                        year: o.year(),
                        impliedComponents: ["month", "year"]
                    }
                })
            }, i
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        chrono.parsers.DateOnlyParser = e
    }(),
    function () {
        function n(n, r, i) {
            i = i || {}, r = r || new Date;
            var s = chrono.Parser(n, r, i);
            return s.pattern = function () {
                return e
            }, s.extract = function (n, i) {
                var s = this.results(),
                    o = s[s.length - 1];
                if (o && i < o.index + o.text.length) return null;
                var u = n.substr(i).match(e);
                if (u == null) {
                    finished = !0;
                    return
                }
                var n = u[0];
                i += u[1].length, n = u[0].substr(u[1].length, u[0].length - u[9].length - u[1].length);
                var a = u[5],
                    f = u[6];
                f = f.toLowerCase();
                var l = t[f];
                if (l === undefined) return null;
                var c = moment(r).clone();
                if (a) a = a.toLowerCase(), a == "last" ? c.day(l - 7) : a == "next" ? c.day(l + 7) : a == "this" && c.day(l);
                else {
                    var h = c.day();
                    l > h ? c.day(l) : c.day(l + 7)
                }
                return new chrono.ParseResult({
                    referenceDate: r,
                    text: n,
                    index: i,
                    start: {
                        day: c.date(),
                        month: c.month(),
                        year: c.year(),
                        dayOfWeek: l,
                        impliedComponents: ["day", "month", "year"]
                    }
                })
            }, s
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = /(\W|^)((\,|\(|\（)\s*)?((this|last|next)\s*)?(Sunday|Sun|Monday|Mon|Tuesday|Wednesday|Wed|Thursday|Thurs|Thur|Friday|Fri|Saturday|Sat)(\s*(\,|\)|\）))?(\W|$)/i,
            t = {
                sunday: 0,
                sun: 0,
                monday: 1,
                mon: 1,
                tuesday: 2,
                tue: 2,
                wednesday: 3,
                wed: 3,
                thursday: 4,
                thurs: 4,
                thur: 4,
                thu: 4,
                friday: 5,
                fri: 5,
                saturday: 6,
                sat: 6
            };
        chrono.parsers.DayOfWeekParser = n
    }(),
    function () {
        function t(t, n, r) {
            r = r || {}, n = n || new Date;
            var i = chrono.Parser(t, n, r);
            return i.pattern = function () {
                return e
            }, i.extract = function (t, r) {
                var s = t.substr(r).match(e);
                if (s == null) {
                    finished = !0;
                    return
                }
                var o = null,
                    u = s[0].toLowerCase();
                u = s[0].substr(0, s[0].length - s[12].length);
                var a = null,
                    f = u.toLowerCase();
                if (f == "today" || f == "tonight") a = moment(n).clone();
                else if (f == "tomorrow") moment(n).hour() < 4 ? a = moment(n).clone().hour(6) : a = moment(n).clone().add("d", 1);
                else if (f == "yesterday") a = moment(n).clone().add("d", -1);
                else if (f.match("last")) a = moment(n).clone().add("d", -1);
                else if (f.match("ago")) {
                    var l = s[2];
                    l = parseInt(l), a = moment(n).clone().add("d", -l)
                } else {
                    if (t.charAt(r - 1).match(/\d/)) return null;
                    if (t.match(/\d+(\.\d+)%/)) return null;
                    while (t.charAt(r) == " ") r++;
                    o = ["year", "month", "day"], a = moment(n).clone(), u = ""
                }
                var c = new chrono.ParseResult({
                    referenceDate: n,
                    text: u,
                    index: r,
                    start: {
                        day: a.date(),
                        month: a.month(),
                        year: a.year(),
                        impliedComponents: o
                    }
                }),
                    h = i.extractTime(t, c);
                return c = h || c, c.text.replace(/\s/g, "").length == 0 ? null : (f.match("night") && (h ? h.start.hour < 6 ? (a.add("d", 1), c.start.day = a.date(), c.start.month = a.month(), c.start.year = a.year(), c = new chrono.ParseResult(c)) : h.start.hour < 12 && !h.start.meridiem && (c.start.hour = h.start.hour + 12, c.start.meridiem = "pm", c.start.impliedComponents = c.start.impliedComponents || [], c.start.impliedComponents.push("meridiem"), c = new chrono.ParseResult(c)) : (c.start.day = a.date() + 1, c.start.hour = 0, c.start.minute = 0, c.start.second = 0, c.start.impliedComponents = ["hour", "minute", "second"], c = new chrono.ParseResult(c))), c)
            }, i
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = /(today|tonight|tomorrow|yesterday|last\s*night|([1-9]+)\s*day(s)\s*ago|([0-9]{1,2})(\.|\:|\：)([0-9]{2})|([0-9]{1,2}\s*\W?\s*)?([0-9]{1,2})\s*(AM|PM)|at\s*([0-9]{1,2}|noon|midnight)|(noon|midnight))(\W|$)/i;
        chrono.parsers.GeneralDateParser = t
    }(),
    function () {
        function t(t, n, r) {
            r = r || {}, n = n || new Date;
            var i = chrono.Parser(t, n, r);
            return i.pattern = function () {
                return e
            }, i.extract = function (t, r) {
                var i = t.substr(r).match(e);
                if (i == null) {
                    finished = !0;
                    return
                }
                var t = i[0];
                t = i[0].substr(0, i[0].length - i[4].length);
                var s = moment(t, "YYYY-MM-DD");
                return s.format("YYYY-M-D") != t && s.format("YYYY-MM-DD") != t ? null : new chrono.ParseResult({
                    referenceDate: n,
                    text: t,
                    index: r,
                    start: {
                        day: s.date(),
                        month: s.month(),
                        year: s.year(),
                        dayOfWeek: s.day()
                    }
                })
            }, i
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = /([0-9]{4})\-([0-9]{1,2})\-([0-9]{1,2})(\W|$)/i;
        chrono.parsers.InternationalStandardParser = t
    }(),
    function () {
        function r(r, i, s) {
            s = s || {}, i = i || new Date;
            var o = chrono.Parser(r, i, s);
            o.pattern = function () {
                return n
            }, o.extract = function (r, s) {
                var o = [],
                    u = null,
                    a = null;
                r = r.substr(s), originalText = r;
                var f = r.match(t);
                if (f && r.indexOf(f[0]) == 0) {
                    r = f[0], r = f[0].substr(f[1].length, f[0].length - f[13].length - f[1].length), s += f[1].length, originalText = r, f[5] && (r = r.replace(f[5], "")), f[6] && (r = r.replace(f[6], ""));
                    var l = f[11];
                    l = parseInt(l), l < 100 ? l > 20 ? l = null : l += 2e3 : f[12] && (r = r.replace(f[12], ""), l -= 543), r = r.replace(f[11], " " + l), u = moment(r, "DD MMMM YYYY");
                    if (!u) return null
                } else {
                    f = r.match(n);
                    if (!f) return null;
                    var r = f[0];
                    r = f[0].substr(f[1].length, f[0].length - f[11].length - f[1].length), s += f[1].length, originalText = r, f[5] && (r = r.replace(f[5], "")), f[6] && (r = r.replace(f[6], "")), u = moment(r, "DD MMMM");
                    if (!u) return null;
                    o.push("year"), u.year(moment(i).year());
                    var c = u.clone().add("y", 1),
                        h = u.clone().add("y", -1);
                    Math.abs(c.diff(moment(i))) < Math.abs(u.diff(moment(i))) ? u = c : Math.abs(h.diff(moment(i))) < Math.abs(u.diff(moment(i))) && (u = h)
                }
                f[3] && (a = e[f[3].toLowerCase()]);
                if (f[8]) {
                    var p = parseInt(f[8]),
                        d = parseInt(f[4]),
                        v = u.clone();
                    return u.date(d), v.date(p), u.format("D") != f[4] ? null : v.format("D") != f[8] ? null : new chrono.ParseResult({
                        referenceDate: i,
                        text: originalText,
                        index: s,
                        start: {
                            day: u.date(),
                            month: u.month(),
                            year: u.year(),
                            dayOfWeek: a,
                            impliedComponents: o
                        },
                        end: {
                            day: v.date(),
                            month: v.month(),
                            year: v.year(),
                            impliedComponents: o
                        }
                    })
                }
                return u.format("D") != f[4] ? null : new chrono.ParseResult({
                    referenceDate: i,
                    text: originalText,
                    index: s,
                    start: {
                        day: u.date(),
                        month: u.month(),
                        year: u.year(),
                        dayOfWeek: a,
                        impliedComponents: o
                    }
                })
            };
            var u = o.extractTime;
            return o.extractTime = function (e, t) {
                var n = /(\,|\(|\s)*(Sun|Sunday|Mon|Monday|Tue|Tuesday|Wed|Wednesday|Thur|Thursday|Fri|Friday|Sat|Saturday)(\,|\)|\s)*/i;
                if (e.length <= t.index + t.text.length) return null;
                var r = e.substr(t.index + t.text.length),
                    i = r.match(n);
                return i && r.indexOf(i[0]) == 0 && (t.text = t.text + i[0]), u.call(this, e, t)
            }, o
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = {
            sunday: 0,
            sun: 0,
            monday: 1,
            mon: 1,
            tuesday: 2,
            tue: 2,
            wednesday: 3,
            wed: 3,
            thursday: 4,
            thur: 4,
            thu: 4,
            friday: 5,
            fri: 5,
            saturday: 6,
            sat: 6
        }, t = /(\W|^)((Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s*,?\s*)?([0-9]{1,2})(st|nd|rd|th)?(\s*(to|\-|\s)\s*([0-9]{1,2})(st|nd|rd|th)?)?\s*(January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|October|Oct|November|Nov|December|Dec)(\s*[0-9]{2,4})(\s*BE)?(\W|$)/i,
            n = /(\W|^)((Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s*,?\s*)?([0-9]{1,2})(st|nd|rd|th)?(\s*(to|\-|\s)\s*([0-9]{1,2})(st|nd|rd|th)?)?\s*(January|Jan|February|Feb|March|Mar|April|Apr|May|June|Jun|July|Jul|August|Aug|September|Sep|October|Oct|November|Nov|December|Dec)(\W|$)/i;
        chrono.parsers.MonthNameLittleEndianParser = r
    }(),
    function () {
        function r(r, i, s) {
            s = s || {}, i = i || new Date;
            var o = chrono.Parser(r, i, s);
            o.pattern = function () {
                return n
            }, o.extract = function (r, s) {
                var o = [],
                    u = null,
                    a = null,
                    f = "";
                r = r.substr(s);
                var l = r.match(t);
                if (l && r.indexOf(l[0]) == 0) {
                    var r = l[0];
                    r = r.substring(l[1].length, l[0].length - l[14].length), s += l[1].length, f = r, r = r.replace(l[2], ""), r = r.replace(l[4], l[4] + " "), l[5] && (r = r.replace(l[5], "")), l[10] && (r = r.replace(l[10], "")), l[11] && (r = r.replace(",", " "));
                    if (l[13]) {
                        var c = l[12];
                        c = " " + (parseInt(c) - 543), r = r.replace(l[13], ""), r = r.replace(l[12], c)
                    }
                    r = r.replace(l[9], parseInt(l[9]) + ""), u = moment(r, "MMMM DD YYYY");
                    if (!u) return null
                } else {
                    l = r.match(n);
                    if (!l) return null;
                    var r = l[0];
                    r = r.substring(l[1].length, l[0].length - l[11].length), s += l[1].length, f = r, r = r.replace(l[2], ""), r = r.replace(l[4], l[4] + " "), l[4] && (r = r.replace(l[5], "")), u = moment(r, "MMMM DD");
                    if (!u) return null;
                    o.push("year"), u.year(moment(i).year());
                    var h = u.clone().add("y", 1),
                        p = u.clone().add("y", -1);
                    Math.abs(h.diff(moment(i))) < Math.abs(u.diff(moment(i))) ? u = h : Math.abs(p.diff(moment(i))) < Math.abs(u.diff(moment(i))) && (u = p)
                }
                l[3] && (a = e[l[3].toLowerCase()]);
                if (l[5]) {
                    var d = parseInt(l[9]),
                        v = parseInt(l[6]),
                        m = u.clone();
                    return u.date(v), m.date(d), u.format("D") != l[6] ? null : m.format("D") != l[9] ? null : new chrono.ParseResult({
                        referenceDate: i,
                        text: f,
                        index: s,
                        start: {
                            day: u.date(),
                            month: u.month(),
                            year: u.year(),
                            dayOfWeek: a,
                            impliedComponents: o
                        },
                        end: {
                            day: m.date(),
                            month: m.month(),
                            year: m.year(),
                            impliedComponents: o
                        }
                    })
                }
                return u.format("D") != parseInt(l[9]) + "" ? null : new chrono.ParseResult({
                    referenceDate: i,
                    text: f,
                    index: s,
                    start: {
                        day: u.date(),
                        month: u.month(),
                        year: u.year(),
                        dayOfWeek: a,
                        impliedComponents: o
                    }
                })
            };
            var u = o.extractTime;
            return o.extractTime = function (t, n) {
                var r = /(\,|\(|\s)*(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sun|Mon|Tue|Wed|Thu|Fri|Sat)(\,|\)|\s)*/i;
                if (t.length <= n.index + n.text.length) return null;
                var i = t.substr(n.index + n.text.length, 15),
                    s = i.match(r);
                if (s && i.indexOf(s[0]) == 0) {
                    n.text = n.text + s[0];
                    var o = e[s[2].toLowerCase()];
                    n.start.dayOfWeek = o
                }
                if (!n.start.impliedComponents || n.start.impliedComponents.indexOf("year") < 0) return u.call(this, t, n);
                var a = /(\s*[0-9]{4})(\s*BE)?/i;
                if (t.length <= n.index + n.text.length) return null;
                var i = t.substr(n.index + n.text.length, 15),
                    s = i.match(a);
                if (s && i.indexOf(s[0]) == 0) {
                    var f = s[1];
                    f = parseInt(f), f < 100 ? f > 20 ? f = null : f += 2e3 : s[2] && (f -= 543);
                    var l = n.start.impliedComponents.indexOf("year");
                    n.start.impliedComponents.splice(l, 1), n.start.year = f, n.text = n.text + s[0]
                }
                return u.call(this, t, n)
            }, o
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = {
            sunday: 0,
            sun: 0,
            monday: 1,
            mon: 1,
            tuesday: 2,
            tue: 2,
            wednesday: 3,
            wed: 3,
            thursday: 4,
            thur: 4,
            thu: 4,
            friday: 5,
            fri: 5,
            saturday: 6,
            sat: 6
        }, t = /(\W|^)((Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s*,?\s*)?(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December)\s*(([0-9]{1,2})(st|nd|rd|th)?\s*(to|\-)\s*)?([0-9]{1,2})(st|nd|rd|th)?(,)?(\s*[0-9]{4})(\s*BE)?(\W|$)/i,
            n = /(\W|^)((Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s*,?\s*)?(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sep|September|Oct|October|Nov|November|Dec|December)\s*(([0-9]{1,2})(st|nd|rd|th)?\s*(to|\-)\s*)?([0-9]{1,2})(st|nd|rd|th)?([^0-9]|$)/i;
        chrono.parsers.MonthNameMiddleEndianParser = r
    }(),
    function () {
        function n(n, r, i) {
            i = i || {}, r = r || new Date;
            var s = chrono.Parser(n, r, i);
            return s.pattern = function () {
                return t
            }, s.extract = function (n, i) {
                var s = n.substr(i).match(t);
                if (s == null) return;
                if (s[1] == "/" || s[7] == "/") return;
                var n = s[0].substr(s[1].length, s[0].length - s[7].length),
                    o = n;
                if (n.match(/^\d.\d$/)) return;
                i += s[1].length;
                if (!s[6] && s[0].indexOf("/") < 0) return;
                var u = null,
                    a = s[6] || moment(r).year() + "",
                    f = s[3],
                    l = s[4],
                    c = null;
                s[2] && (c = e[s[2].toLowerCase()]), f = parseInt(f), l = parseInt(l), a = parseInt(a);
                if (f < 1 || f > 12) return null;
                if (l < 1 || l > 31) return null;
                a < 100 && (a > 50 ? a = a + 2500 - 543 : a += 2e3), n = f + "/" + l + "/" + a, u = moment(n, "M/D/YYYY");
                if (!u || u.date() != l) {
                    u = moment(n, "D/M/YYYY");
                    if (!u || u.date() != f) return null
                }
                return new chrono.ParseResult({
                    referenceDate: r,
                    text: o,
                    index: i,
                    start: {
                        day: u.date(),
                        month: u.month(),
                        year: u.year(),
                        dayOfWeek: c
                    }
                })
            }, s
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = {
            sunday: 0,
            sun: 0,
            monday: 1,
            mon: 1,
            tuesday: 2,
            wednesday: 3,
            wed: 3,
            thursday: 4,
            thur: 4,
            friday: 5,
            fri: 5,
            saturday: 6,
            sat: 6
        }, t = /(\W|^)(Sun|Sunday|Mon|Monday|Tue|Tuesday|Wed|Wednesday|Thur|Thursday|Fri|Friday|Sat|Saturday)?\s*\,?\s*([0-9]{1,2})[\/\.]([0-9]{1,2})([\/\.]([0-9]{4}|[0-9]{2}))?(\W|$)/i;
        chrono.parsers.SlashParser = n
    }(),
    function () {
        function n(n, r, i) {
            i = i || {}, r = r || new Date;
            var s = chrono.parsers.THGeneralDateParser(n, r, i);
            return s.pattern = function () {
                return e
            }, s.extract = function (n, i) {
                var s = this.results(),
                    o = s[s.length - 1];
                if (o && i < o.index + o.text.length) return null;
                var u = n.substr(i).match(e);
                if (u == null) return;
                var n = u[0],
                    a = u[2];
                a = a.toLowerCase();
                var f = t[a];
                if (f === undefined) return null;
                var l = moment(r).clone(),
                    c = u[3];
                return c == "นี้" ? l.day(f) : c == "หน้า" ? l.day(f + 7) : c == "ที่แล้ว" ? l.day(f - 7) : (l.day(f), n = u[0].substr(0, u[0].length - u[3].length)), new chrono.ParseResult({
                    referenceDate: r,
                    text: n,
                    index: i,
                    start: {
                        day: l.date(),
                        month: l.month(),
                        year: l.year()
                    }
                })
            }, s
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = /(วัน)?(อาทิตย์|จันทร์|อังคาร|พุธ|พฤหัสบดี|ศุกร์|เสาร์)(หน้า|นี้|ที่แล้ว|.|$)/i,
            t = {
                "อาทิตย์": 0,
                "จันทร์": 1,
                "อังคาร": 2,
                "พุธ": 3,
                "พฤหัสบดี": 4,
                "ศุกร์": 5,
                "เสาร์": 6
            };
        chrono.parsers.THDayOfWeekParser = n
    }(),
    function () {
        function t(t, n, r) {
            r = r || {}, n = n || new Date;
            var i = chrono.Parser(t, n, r);
            return i.pattern = function () {
                return e
            }, i.extract = function (t, r) {
                var s = this.results(),
                    o = s[s.length - 1];
                if (o && r < o.index + o.text.length) return null;
                var u = t.substr(r).match(e);
                if (u == null) {
                    finished = !0;
                    return
                }
                var a = u[0].toLowerCase();
                a = u[0].substr(0, u[0].length - u[5].length);
                var f = null;
                if (a == "วันนี้") f = moment(n).clone();
                else if (a == "พรุ่งนี้") f = moment(n).clone().add("d", 1);
                else if (a == "เมื่อวาน") f = moment(n).clone().add("d", -1);
                else if (a == "เมื่อคืน") f = moment(n).clone().add("d", -1);
                else {
                    var l = u[2];
                    l = parseInt(l), f = moment(n).clone().add("d", -l)
                }
                var c = new chrono.ParseResult({
                    referenceDate: n,
                    text: a,
                    index: r,
                    start: {
                        day: f.date(),
                        month: f.month(),
                        year: f.year()
                    }
                }),
                    h = i.extractTime(t, c);
                return c = h || c, a.match("คืน") && (h ? h.start.hour < 12 && (f.add("d", 1), c.start.day = f.date(), c.start.month = f.month(), c.start.year = f.year(), c = new chrono.ParseResult(c)) : (c.start.day = f.date() + 1, c.start.hour = 0, c.start.minute = 0, c.start.second = 0, c = new chrono.ParseResult(c))), c
            }, i
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = /(วันนี้|พรุ่งนี้|เมื่อวาน|เมื่อคืน|([1-9]+)\s*(วัน|คืน)(ก่อน|ที่แล้ว))(\W|$)/i;
        chrono.parsers.THGeneralDateParser = t
    }(),
    function () {
        function r(r, i, s) {
            s = s || {}, i = i || new Date;
            var o = chrono.parsers.THGeneralDateParser(r, i, s);
            return o.pattern = function () {
                return t
            }, o.extract = function (r, s) {
                var o = this.results(),
                    u = o[o.length - 1];
                if (u && s < u.index + u.text.length) return null;
                var a = null;
                r = r.substr(s), originalText = r;
                var f = r.match(e);
                if (f && r.indexOf(f[0]) == 0) {
                    r = f[0], r = f[0].substr(0, f[0].length - f[8].length), originalText = r;
                    var l = f[7];
                    l = parseInt(l), f[3] && f[3] == "ค.ศ." ? l <= 30 ? l += 2e3 : l < 100 && (l += 1900) : (l < 543 && (l += 2500), l -= 543);
                    var c = n[f[5]];
                    if (typeof c != "number") return null;
                    var h = f[1];
                    h = parseInt(h);
                    var p = l + "-" + (c + 1) + "-" + h,
                        a = moment(p, "YYYY-MM-DD");
                    if (a.format("YYYY-M-D") != p) return null
                } else {
                    f = r.match(t);
                    if (!f) return null;
                    var r = f[0];
                    r = f[0].substr(0, f[0].length - f[6].length), originalText = r;
                    var c = n[f[5]];
                    if (typeof c != "number") return null;
                    var h = f[1];
                    h = parseInt(h);
                    var p = c + 1 + "-" + h,
                        a = moment(p, "MM-DD");
                    if (a.format("M-D") != p) return null;
                    a.year(moment(i).year());
                    var d = a.clone().add("y", 1),
                        v = a.clone().add("y", -1);
                    Math.abs(d.diff(moment(i))) < Math.abs(a.diff(moment(i))) ? a = d : Math.abs(v.diff(moment(i))) < Math.abs(a.diff(moment(i))) && (a = v)
                } if (f[4]) {
                    var m = parseInt(f[4]),
                        g = parseInt(f[1]),
                        y = a.clone();
                    return a.date(g), y.date(m), a.format("D") != f[1] ? null : y.format("D") != f[4] ? null : new chrono.ParseResult({
                        referenceDate: i,
                        text: originalText,
                        index: s,
                        start: {
                            day: a.date(),
                            month: a.month(),
                            year: a.year()
                        },
                        end: {
                            day: y.date(),
                            month: y.month(),
                            year: y.year()
                        }
                    })
                }
                return new chrono.ParseResult({
                    referenceDate: i,
                    text: originalText,
                    index: s,
                    start: {
                        day: a.date(),
                        month: a.month(),
                        year: a.year()
                    }
                })
            }, o
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = /([0-9]{1,2})(\s*(ถึง|\-)?\s*([0-9]{1,2}))?\s+(มกราคม|ม.ค.|กุมภาพัน|ก.พ.|มีนาคม|มี.ค.|เมษายน|เม.ย.|พฤษภาคม|พ.ค.|มิถุนายน|ม.ย.|มิ.ย.|กรกฎาคม|ก.ค.|สิงหาคม|ส.ค.|กันยายน|ก.ย.|ตุลาคม|ต.ค.|พฤศจิกายน|พ.ย.|ธันวาคม|ธ.ค.)(พ.ศ.|ค.ศ.)?(\s+[0-9]{2,4})(\W|$)/i,
            t = /([0-9]{1,2})(\s*(ถึง|\-)?\s*([0-9]{1,2}))?\s+(มกราคม|ม.ค.|กุมภาพัน|ก.พ.|มีนาคม|มี.ค.|เมษายน|เม.ย.|พฤษภาคม|พ.ค.|มิถุนายน|ม.ย.|มิ.ย.|กรกฏาคม|ก.ค.|สิงหาคม|ส.ค.|กันยายน|ก.ย.|ตุลาคม|ต.ค.|พฤศจิกายน|พ.ย.|ธันวาคม|ธ.ค.)(\W|$)/i,
            n = {
                "มกราคม": 0,
                "ม.ค.": 0,
                "กุมภาพัน": 1,
                "ก.พ.": 1,
                "มีนาคม": 2,
                "มี.ค.": 2,
                "เมษายน": 3,
                "เม.ย.": 4,
                "พฤษภาคม": 4,
                "พ.ค.": 4,
                "มิถุนายน": 5,
                "มิ.ย.": 5,
                "กรกฎาคม": 6,
                "ก.ค.": 6,
                "สิงหาคม": 7,
                "ส.ค.": 7,
                "กันยายน": 8,
                "ก.ย.": 8,
                "ตุลาคม": 9,
                "ต.ค.": 9,
                "พฤศจิกายน": 10,
                "พ.ย.": 10,
                "ธันวาคม": 11,
                "ธ.ค.": 11
            };
        chrono.parsers.THMonthNameLittleEndianParser = r
    }(),
    function () {
        function t(t, n, r) {
            r = r || {}, n = n || new Date;
            var i = chrono.Parser(t, n, r);
            i.pattern = function () {
                return e
            }, i.extract = function (t, r) {
                var s = this.results(),
                    o = s[s.length - 1];
                if (o && r < o.index + o.text.length) return null;
                var u = t.substr(r).match(e);
                if (u == null) {
                    finished = !0;
                    return
                }
                var a = u[0].toLowerCase();
                a = u[0].substr(0, u[0].length - u[3].length);
                var f = null;
                if (a == "今日") f = moment(n).clone();
                else if (a == "明日") f = moment(n).clone().add("d", 1);
                else if (a == "昨日") f = moment(n).clone().add("d", -1);
                else {
                    var l = u[2];
                    l = parseInt(l), f = moment(n).clone().add("d", -l)
                }
                var c = new chrono.ParseResult({
                    referenceDate: n,
                    text: a,
                    index: r,
                    start: {
                        day: f.date(),
                        month: f.month(),
                        year: f.year()
                    }
                }),
                    h = i.extractTime(t, c);
                return c = h || c, c
            };
            var s = i.extractTime;
            return i.extractTime = function (e, t) {
                var n = s.call(this, e, t);
                if (n) return n;
                var r = /\s*(午前|午後)?\s*([0-9]{1,2})時?(([0-9]{1,2})分)?/i;
                if (e.length <= t.index + t.text.length) return null;
                e = e.substr(t.index + t.text.length);
                var i = e.match(r);
                if (!i || e.indexOf(i[0]) != 0) return null;
                var o = 0,
                    u = 0,
                    a = i[2];
                a = parseInt(a);
                if (i[1]) {
                    if (a > 12) return null;
                    i[1] == "午後" && (a += 12)
                }
                if (i[4]) {
                    o = i[4], o = parseInt(o);
                    if (o >= 60) return null
                }
                return t.text = t.text + i[0], t.start.hour == undefined && (t.start.hour = a, t.start.minute = o, t.start.second = u), t.end && t.end.hour == undefined && (t.end.hour = a, t.end.minute = o, t.end.second = u), new chrono.ParseResult(t)
            }, i
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = /(今日|昨日|明日|([1-9]+)\s*日前)(\W|$)/i;
        chrono.parsers.JPGeneralDateParser = t
    }(),
    function () {
        function t(e) {
            var t = e;
            return t = t.replace(/０/g, "0"), t = t.replace(/１/g, "1"), t = t.replace(/２/g, "2"), t = t.replace(/３/g, "3"), t = t.replace(/４/g, "4"), t = t.replace(/５/g, "5"), t = t.replace(/６/g, "6"), t = t.replace(/７/g, "7"), t = t.replace(/８/g, "8"), t = t.replace(/９/g, "9"), t
        }

        function n(n, r, i) {
            i = i || {}, r = r || new Date;
            var s = chrono.parsers.JPGeneralDateParser(n, r, i);
            s.pattern = function () {
                return e
            }, s.extract = function (n, i) {
                var o = this.results(),
                    u = o[o.length - 1];
                if (u && i < u.index + u.text.length) return null;
                var a = n.substr(i).match(e);
                if (a == null) {
                    finished = !0;
                    return
                }
                var f = a[0].toLowerCase(),
                    l = null;
                f = a[0];
                var c = a[6];
                c = t(c), c = parseInt(c);
                if (!c || c == NaN) return null;
                var h = a[7];
                h = t(h), h = parseInt(h);
                if (!h || h == NaN) return null;
                var p = a[5];
                p && (p = t(p), p = parseInt(p));
                if (p && p !== NaN) {
                    a[4] == "平成" ? p += 1989 : p < 100 && (p += 2e3);
                    var d = p + "-" + c + "-" + h;
                    l = moment(d, "YYYY-MM-DD");
                    if (l.format("YYYY-M-D") != d) return null
                } else {
                    var d = c + "-" + h;
                    l = moment(d, "MM-DD"), l.year(moment(r).year());
                    var v = l.clone().add("y", 1),
                        m = l.clone().add("y", -1);
                    Math.abs(v.diff(moment(r))) < Math.abs(l.diff(moment(r))) ? l = v : Math.abs(m.diff(moment(r))) < Math.abs(l.diff(moment(r))) && (l = m)
                }
                var g = new chrono.ParseResult({
                    referenceDate: r,
                    text: f,
                    index: i,
                    start: {
                        day: l.date(),
                        month: l.month(),
                        year: l.year()
                    }
                }),
                    y = s.extractTime(n, g);
                return g = y || g, g
            };
            var o = s.extractTime;
            return s.extractTime = function (e, t) {
                var n = /(\,|\(|（|\s)*(月|火|水|木|金|土|日)(曜日|曜)?\s*(\,|）|\))/i;
                if (e.length <= t.index + t.text.length) return null;
                var r = e.substr(t.index + t.text.length),
                    i = r.match(n);
                return i && r.indexOf(i[0]) == 0 && (t.text = t.text + i[0]), o.call(this, e, t)
            }, s
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        var e = /((同|((平成)?([0-9０-９]{2,4})))年\s*)?([0-9０-９]{1,2})月\s*([0-9０-９]{1,2})日/i;
        chrono.parsers.JPStandardDateParser = n
    }(),
    function () {
        function e(e, t, n) {
            var r = {};
            for (var i in chrono.refiners) {
                var s = chrono.refiners[i],
                    o = s.order || 0;
                r[o] = r[o] || [], r[o].push(s)
            }
            for (var o in r) r[o].forEach(function (r) {
                t = r.refine(e, t, n)
            });
            return t
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        chrono.integratedRefine = e
    }(),
    function () {
        function e(e, t, n) {
            if (t.length < 2) return t;
            var r = [];
            for (var i = 0; i < t.length - 1; i++) {
                var s = t[i + 1],
                    o = t[i],
                    u = e.substring(o.index + o.text.length, s.index),
                    a = /^\s*(of|on|\W)?\s*$/i;
                if (!u.match(a)) {
                    r.push(o);
                    continue
                }
                if (o.start.hour === undefined) {
                    if (s.start.hour === undefined) {
                        r.push(o);
                        continue
                    }
                    var f = new Object(o.start),
                        l = new Object(s.start)
                } else {
                    if (s.start.hour !== undefined) {
                        r.push(o);
                        continue
                    }
                    var l = new Object(o.start),
                        f = new Object(s.start)
                }
                f.hour = l.hour, f.minute = l.minute, f.second = l.second, f.meridiem = l.meridiem, f.impliedComponents = f.impliedComponents || [], o.start = new chrono.DateComponents(f);
                if (o.end || s.end) o.start.hour !== undefined ? (l = o.end || l, f = s.end || f) : (f = o.end || f, l = s.end || l), f.hour = l.hour, f.minute = l.minute, f.second = l.second, f.impliedComponents = f.impliedComponents || [], o.end = new chrono.DateComponents(f);
                o.text = o.text + u + s.text, r.push(new chrono.ParseResult(o)), i++
            }
            return t
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        chrono.refiners.MergeComponentsRefine = {
            refine: e
        }
    }(),
    function () {
        function e(e, t, n) {
            if (t.length < 2) return t;
            for (var r = 0; r < t.length; r++) {
                var i = null,
                    s = t[r];
                if (!t[r + 1]) i = t[r - 1];
                else if (!t[r - 1]) i = t[r + 1];
                else {
                    var o = t[r + 1],
                        u = o.index - (s.index + s.text.length),
                        a = t[r - 1],
                        f = s.index - (a.index + a.text.length);
                    f > u ? i = o : i = a
                }
                var l = s.start.impliedComponents || [],
                    c = i.start.impliedComponents || [];
                s.start.hour === undefined && l.push("hour"), s.start.minute === undefined && l.push("minute"), l.forEach(function (e) {
                    c.indexOf(e) < 0 && i.start[e] && (s.start[e] = i.start[e])
                }), s.start.impliedComponents = l;
                if (l.indexOf("day") >= 0 && l.indexOf("month") >= 0 && s.start.dayOfWeek !== undefined && l.indexOf("dayOfWeek") < 0) {
                    var h = moment(s.start.date());
                    h.day(s.start.dayOfWeek), s.start.day = h.date(), s.start.month = h.month()
                }
                if (s.start.dayOfWeek === undefined || l.indexOf("dayOfWeek") >= 0) {
                    var h = moment(s.start.date());
                    s.start.dayOfWeek = h.day(), l.indexOf("dayOfWeek") < 0 && s.start.impliedComponents.push("dayOfWeek")
                }
            }
            return t
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        chrono.refiners.MissingComponentsRefiner = {
            refine: e,
            order: 500
        }
    }(),
    function () {
        function e(e, n, r) {
            var i = [],
                s = /(\W)\s*$/,
                o = /^\s*(\W)/;
            for (var u = 0; u < n.length; u++) t(i, n[u]);
            return i
        }

        function t(e, t) {
            var n = 0;
            while (n < e.length && e[n].index < t.index) n++;
            if (n < e.length) {
                var r = n;
                while (r < e.length && e[r].index < t.index + t.text.length) {
                    if (e[r].text.length >= t.text.length) return e;
                    r++
                }
                e.splice(n, r - n)
            }
            if (n - 1 >= 0) {
                var i = e[n - 1];
                if (t.index < i.index + i.text.length) {
                    if (i.text.length >= t.text.length) return e;
                    e.splice(n - 1, 1), n -= 1
                }
            }
            return e.splice(n, 0, t), e
        }
        if (typeof chrono == "undefined") throw "Cannot find the chrono main module";
        chrono.refiners.RemoveReplicateRefiner = {
            refine: e,
            order: 1e3
        }
    }()
})();