/**
 * plupload.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */
(function () {
    var c = 0,
        h = [],
        j = {},
        f = {},
        a = {
            "<": "lt",
            ">": "gt",
            "&": "amp",
            '"': "quot",
            "'": "#39"
        },
        i = /[<>&\"\']/g,
        b;

    function e() {
        this.returnValue = false
    }
    function g() {
        this.cancelBubble = true
    }(function (k) {
        var l = k.split(/,/),
            m, o, n;
        for (m = 0; m < l.length; m += 2) {
            n = l[m + 1].split(/ /);
            for (o = 0; o < n.length; o++) {
                f[n[o]] = l[m]
            }
        }
    })("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats,docx pptx xlsx,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/html,htm html xhtml,text/rtf,rtf,video/mpeg,mpeg mpg mpe,video/quicktime,qt mov,video/x-flv,flv,video/vnd.rn-realvideo,rv,text/plain,asc txt text diff log,application/octet-stream,exe");
    var d = {
        STOPPED: 1,
        STARTED: 2,
        QUEUED: 1,
        UPLOADING: 2,
        FAILED: 4,
        DONE: 5,
        GENERIC_ERROR: -100,
        HTTP_ERROR: -200,
        IO_ERROR: -300,
        SECURITY_ERROR: -400,
        INIT_ERROR: -500,
        FILE_SIZE_ERROR: -600,
        FILE_EXTENSION_ERROR: -700,
        mimeTypes: f,
        extend: function (k) {
            d.each(arguments, function (l, m) {
                if (m > 0) {
                    d.each(l, function (o, n) {
                        k[n] = o
                    })
                }
            });
            return k
        },
        cleanName: function (k) {
            var l, m;
            m = [/[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u"];
            for (l = 0; l < m.length; l += 2) {
                k = k.replace(m[l], m[l + 1])
            }
            k = k.replace(/\s+/g, "_");
            k = k.replace(/[^a-z0-9_\-\.]+/gi, "");
            return k
        },
        addRuntime: function (k, l) {
            l.name = k;
            h[k] = l;
            h.push(l);
            return l
        },
        guid: function () {
            var k = new Date().getTime().toString(32),
                l;
            for (l = 0; l < 5; l++) {
                k += Math.floor(Math.random() * 65535).toString(32)
            }
            return (d.guidPrefix || "p") + k + (c++).toString(32)
        },
        buildUrl: function (l, k) {
            var m = "";
            d.each(k, function (o, n) {
                m += (m ? "&" : "") + encodeURIComponent(n) + "=" + encodeURIComponent(o)
            });
            if (m) {
                l += (l.indexOf("?") > 0 ? "&" : "?") + m
            }
            return l
        },
        each: function (n, o) {
            var m, l, k;
            if (n) {
                m = n.length;
                if (m === b) {
                    for (l in n) {
                        if (n.hasOwnProperty(l)) {
                            if (o(n[l], l) === false) {
                                return
                            }
                        }
                    }
                } else {
                    for (k = 0; k < m; k++) {
                        if (o(n[k], k) === false) {
                            return
                        }
                    }
                }
            }
        },
        formatSize: function (k) {
            if (k === b) {
                return d.translate("N/A")
            }
            if (k > 1048576) {
                return Math.round(k / 1048576, 1) + " MB"
            }
            if (k > 1024) {
                return Math.round(k / 1024, 1) + " KB"
            }
            return k + " b"
        },
        getPos: function (l, p) {
            var q = 0,
                o = 0,
                s, r = document,
                m, n;
            l = l;
            p = p || r.body;

            function k(w) {
                var u, v, t = 0,
                    z = 0;
                if (w) {
                    v = w.getBoundingClientRect();
                    u = r.compatMode === "CSS1Compat" ? r.documentElement : r.body;
                    t = v.left + u.scrollLeft;
                    z = v.top + u.scrollTop
                }
                return {
                    x: t,
                    y: z
                }
            }
            if (l.getBoundingClientRect && (navigator.userAgent.indexOf("MSIE") > 0 && r.documentMode !== 8)) {
                m = k(l);
                n = k(p);
                return {
                    x: m.x - n.x,
                    y: m.y - n.y
                }
            }
            s = l;
            while (s && s != p && s.nodeType) {
                q += s.offsetLeft || 0;
                o += s.offsetTop || 0;
                s = s.offsetParent
            }
            s = l.parentNode;
            while (s && s != p && s.nodeType) {
                q -= s.scrollLeft || 0;
                o -= s.scrollTop || 0;
                s = s.parentNode
            }
            return {
                x: q,
                y: o
            }
        },
        getSize: function (k) {
            return {
                w: k.clientWidth || k.offsetWidth,
                h: k.clientHeight || k.offsetHeight
            }
        },
        parseSize: function (k) {
            var l;
            if (typeof(k) == "string") {
                k = /^([0-9]+)([mgk]+)$/.exec(k.toLowerCase().replace(/[^0-9mkg]/g, ""));
                l = k[2];
                k = +k[1];
                if (l == "g") {
                    k *= 1073741824
                }
                if (l == "m") {
                    k *= 1048576
                }
                if (l == "k") {
                    k *= 1024
                }
            }
            return k
        },
        xmlEncode: function (k) {
            return k ? ("" + k).replace(i, function (l) {
                return a[l] ? "&" + a[l] + ";" : l
            }) : k
        },
        toArray: function (m) {
            var l, k = [];
            for (l = 0; l < m.length; l++) {
                k[l] = m[l]
            }
            return k
        },
        addI18n: function (k) {
            return d.extend(j, k)
        },
        translate: function (k) {
            return j[k] || k
        },
        addEvent: function (l, k, m) {
            if (l.attachEvent) {
                l.attachEvent("on" + k, function () {
                    var n = window.event;
                    if (!n.target) {
                        n.target = n.srcElement
                    }
                    n.preventDefault = e;
                    n.stopPropagation = g;
                    m(n)
                })
            } else {
                if (l.addEventListener) {
                    l.addEventListener(k, m, false)
                }
            }
        }
    };
    d.Uploader = function (n) {
        var l = {},
            q, p = [],
            r, m;
        q = new d.QueueProgress();
        n = d.extend({
            chunk_size: 0,
            multipart: true,
            multi_selection: true,
            file_data_name: "file",
            filters: []
        }, n);

        function o() {
            var s;
            if (this.state == d.STARTED && r < p.length) {
                s = p[r++];
                if (s.status == d.QUEUED) {
                    this.trigger("BeforeUpload", s);
                    this.trigger("UploadFile", s)
                } else {
                    o.call(this)
                }
            } else {
                this.stop()
            }
        }
        function k() {
            var t, s;
            q.reset();
            for (t = 0; t < p.length; t++) {
                s = p[t];
                if (s.size !== b) {
                    q.size += s.size;
                    q.loaded += s.loaded
                } else {
                    q.size = b
                }
                if (s.status == d.DONE) {
                    q.uploaded++
                } else {
                    if (s.status == d.FAILED) {
                        q.failed++
                    } else {
                        q.queued++
                    }
                }
            }
            if (q.size === b) {
                q.percent = p.length > 0 ? Math.ceil(q.uploaded / p.length * 100) : 0
            } else {
                q.bytesPerSec = Math.ceil(q.loaded / ((+new Date() - m || 1) / 1000));
                q.percent = q.size > 0 ? Math.ceil(q.loaded / q.size * 100) : 0
            }
        }
        d.extend(this, {
            state: d.STOPPED,
            features: {},
            files: p,
            settings: n,
            total: q,
            id: d.guid(),
            init: function () {
                var x = this,
                    y, u, t, w = 0,
                    v;
                n.page_url = n.page_url || document.location.pathname.replace(/\/[^\/]+$/g, "/");
                if (!/^(\w+:\/\/|\/)/.test(n.url)) {
                    n.url = n.page_url + n.url
                }
                n.chunk_size = d.parseSize(n.chunk_size);
                n.max_file_size = d.parseSize(n.max_file_size);
                x.bind("FilesAdded", function (z, C) {
                    var B, A, E = 0,
                        F, D = n.filters;
                    if (D && D.length) {
                        F = [];
                        d.each(D, function (G) {
                            d.each(G.extensions.split(/,/), function (H) {
                                F.push("\\." + H.replace(new RegExp("[" + ("/^$.*+?|()[]{}\\".replace(/./g, "\\$&")) + "]", "g"), "\\$&"))
                            })
                        });
                        F = new RegExp(F.join("|") + "$", "i")
                    }
                    for (B = 0; B < C.length; B++) {
                        A = C[B];
                        A.loaded = 0;
                        A.percent = 0;
                        A.status = d.QUEUED;
                        if (F && !F.test(A.name)) {
                            z.trigger("Error", {
                                code: d.FILE_EXTENSION_ERROR,
                                message: "File extension error.",
                                file: A
                            });
                            continue
                        }
                        if (A.size !== b && A.size > n.max_file_size) {
                            z.trigger("Error", {
                                code: d.FILE_SIZE_ERROR,
                                message: "File size error.",
                                file: A
                            });
                            continue
                        }
                        p.push(A);
                        E++
                    }
                    if (E) {
                        x.trigger("QueueChanged");
                        x.refresh()
                    }
                });
                if (n.unique_names) {
                    x.bind("UploadFile", function (z, A) {
                        var C = A.name.match(/\.([^.]+)$/),
                            B = "tmp";
                        if (C) {
                            B = C[1]
                        }
                        A.target_name = A.id + "." + B
                    })
                }
                x.bind("UploadProgress", function (z, A) {
                    if (A.status == d.QUEUED) {
                        A.status = d.UPLOADING
                    }
                    A.percent = A.size > 0 ? Math.ceil(A.loaded / A.size * 100) : 100;
                    k()
                });
                x.bind("StateChanged", function (z) {
                    if (z.state == d.STARTED) {
                        m = (+new Date())
                    }
                });
                x.bind("QueueChanged", k);
                x.bind("Error", function (z, A) {
                    if (A.file) {
                        A.file.status = d.FAILED;
                        k();
                        window.setTimeout(function () {
                            o.call(x)
                        })
                    }
                });
                x.bind("FileUploaded", function (z, A) {
                    A.status = d.DONE;
                    A.loaded = A.size;
                    z.trigger("UploadProgress", A);
                    o.call(x)
                });
                if (n.runtimes) {
                    u = [];
                    v = n.runtimes.split(/\s?,\s?/);
                    for (y = 0; y < v.length; y++) {
                        if (h[v[y]]) {
                            u.push(h[v[y]])
                        }
                    }
                } else {
                    u = h
                }
                function s() {
                    var C = u[w++],
                        B, z, A;
                    if (C) {
                        B = C.getFeatures();
                        z = x.settings.required_features;
                        if (z) {
                            z = z.split(",");
                            for (A = 0; A < z.length; A++) {
                                if (!B[z[A]]) {
                                    s();
                                    return
                                }
                            }
                        }
                        C.init(x, function (D) {
                            if (D && D.success) {
                                x.features = B;
                                x.trigger("Init", {
                                    runtime: C.name
                                });
                                x.trigger("PostInit");
                                x.refresh()
                            } else {
                                s()
                            }
                        })
                    } else {
                        x.trigger("Error", {
                            code: d.INIT_ERROR,
                            message: "Init error."
                        })
                    }
                }
                s()
            },
            refresh: function () {
                this.trigger("Refresh")
            },
            start: function () {
                if (this.state != d.STARTED) {
                    r = 0;
                    this.state = d.STARTED;
                    this.trigger("StateChanged");
                    o.call(this)
                }
            },
            stop: function () {
                if (this.state != d.STOPPED) {
                    this.state = d.STOPPED;
                    this.trigger("StateChanged")
                }
            },
            getFile: function (t) {
                var s;
                for (s = p.length - 1; s >= 0; s--) {
                    if (p[s].id === t) {
                        return p[s]
                    }
                }
            },
            removeFile: function (t) {
                var s;
                for (s = p.length - 1; s >= 0; s--) {
                    if (p[s].id === t.id) {
                        return this.splice(s, 1)[0]
                    }
                }
            },
            splice: function (u, s) {
                var t;
                t = p.splice(u, s);
                this.trigger("FilesRemoved", t);
                this.trigger("QueueChanged");
                return t
            },
            trigger: function (t) {
                var v = l[t.toLowerCase()],
                    u, s;
                if (v) {
                    s = Array.prototype.slice.call(arguments);
                    s[0] = this;
                    for (u = 0; u < v.length; u++) {
                        if (v[u].func.apply(v[u].scope, s) === false) {
                            return false
                        }
                    }
                }
                return true
            },
            bind: function (s, u, t) {
                var v;
                s = s.toLowerCase();
                v = l[s] || [];
                v.push({
                    func: u,
                    scope: t || this
                });
                l[s] = v
            },
            unbind: function (s, u) {
                var v = l[s.toLowerCase()],
                    t;
                if (v) {
                    for (t = v.length - 1; t >= 0; t--) {
                        if (v[t].func === u) {
                            v.splice(t, 1)
                        }
                    }
                }
            }
        })
    };
    d.File = function (n, l, m) {
        var k = this;
        k.id = n;
        k.name = l;
        k.size = m;
        k.loaded = 0;
        k.percent = 0;
        k.status = 0
    };
    d.Runtime = function () {
        this.getFeatures = function () {};
        this.init = function (k, l) {}
    };
    d.QueueProgress = function () {
        var k = this;
        k.size = 0;
        k.loaded = 0;
        k.uploaded = 0;
        k.failed = 0;
        k.queued = 0;
        k.percent = 0;
        k.bytesPerSec = 0;
        k.reset = function () {
            k.size = k.loaded = k.uploaded = k.failed = k.queued = k.percent = k.bytesPerSec = 0
        }
    };
    d.runtimes = {};
    window.plupload = d
})();
(function (b) {
    var c = {};

    function a(i, e, k, j, d) {
        var l, g, f, h;
        g = google.gears.factory.create("beta.canvas");
        g.decode(i);
        h = Math.min(e / g.width, k / g.height);
        if (h < 1) {
            e = Math.round(g.width * h);
            k = Math.round(g.height * h)
        } else {
            e = g.width;
            k = g.height
        }
        g.resize(e, k);
        return g.encode(d, {
            quality: j / 100
        })
    }
    b.runtimes.Gears = b.addRuntime("gears", {
        getFeatures: function () {
            return {
                dragdrop: true,
                jpgresize: true,
                pngresize: true,
                chunks: true,
                progress: true,
                multipart: true
            }
        },
        init: function (g, i) {
            var h;
            if (!window.google || !google.gears) {
                return i({
                    success: false
                })
            }
            try {
                h = google.gears.factory.create("beta.desktop")
            } catch (f) {
                return i({
                    success: false
                })
            }
            function d(k) {
                var j, e, l = [],
                    m;
                for (e = 0; e < k.length; e++) {
                    j = k[e];
                    m = b.guid();
                    c[m] = j.blob;
                    l.push(new b.File(m, j.name, j.blob.length))
                }
                g.trigger("FilesAdded", l)
            }
            g.bind("PostInit", function () {
                var j = g.settings,
                    e = document.getElementById(j.drop_element);
                if (e) {
                    b.addEvent(e, "dragover", function (k) {
                        h.setDropEffect(k, "copy");
                        k.preventDefault()
                    });
                    b.addEvent(e, "drop", function (l) {
                        var k = h.getDragData(l, "application/x-gears-files");
                        if (k) {
                            d(k.files)
                        }
                        l.preventDefault()
                    });
                    e = 0
                }
                b.addEvent(document.getElementById(j.browse_button), "click", function (o) {
                    var n = [],
                        l, k, m;
                    o.preventDefault();
                    for (l = 0; l < j.filters.length; l++) {
                        m = j.filters[l].extensions.split(",");
                        for (k = 0; k < m.length; k++) {
                            n.push("." + m[k])
                        }
                    }
                    h.openFiles(d, {
                        singleFile: !j.multi_selection,
                        filter: n
                    })
                })
            });
            g.bind("UploadFile", function (o, l) {
                var q = 0,
                    p, m, n = 0,
                    k = o.settings.resize,
                    e;
                m = o.settings.chunk_size;
                e = m > 0;
                p = Math.ceil(l.size / m);
                if (!e) {
                    m = l.size;
                    p = 1
                }
                if (k && /\.(png|jpg|jpeg)$/i.test(l.name)) {
                    c[l.id] = a(c[l.id], k.width, k.height, k.quality || 90, /\.png$/i.test(l.name) ? "image/png" : "image/jpeg")
                }
                l.size = c[l.id].length;

                function j() {
                    var u, w, s = o.settings.multipart,
                        r = 0,
                        v = {
                            name: l.target_name || l.name
                        };

                    function t(y) {
                        var x, C = "----pluploadboundary" + b.guid(),
                            A = "--",
                            B = "\r\n",
                            z;
                        if (s) {
                            u.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + C);
                            x = google.gears.factory.create("beta.blobbuilder");
                            b.each(o.settings.multipart_params, function (E, D) {
                                x.append(A + C + B + 'Content-Disposition: form-data; name="' + D + '"' + B + B);
                                x.append(E + B)
                            });
                            x.append(A + C + B + 'Content-Disposition: form-data; name="' + o.settings.file_data_name + '"; filename="' + l.name + '"' + B + "Content-Type: application/octet-stream" + B + B);
                            x.append(y);
                            x.append(B + A + C + A + B);
                            z = x.getAsBlob();
                            r = z.length - y.length;
                            y = z
                        }
                        u.send(y)
                    }
                    if (l.status == b.DONE || l.status == b.FAILED || o.state == b.STOPPED) {
                        return
                    }
                    if (e) {
                        v.chunk = q;
                        v.chunks = p
                    }
                    w = Math.min(m, l.size - (q * m));
                    u = google.gears.factory.create("beta.httprequest");
                    u.open("POST", b.buildUrl(o.settings.url, v));
                    if (!s) {
                        u.setRequestHeader("Content-Disposition", 'attachment; filename="' + l.name + '"');
                        u.setRequestHeader("Content-Type", "application/octet-stream")
                    }
                    b.each(o.settings.headers, function (y, x) {
                        u.setRequestHeader(x, y)
                    });
                    u.upload.onprogress = function (x) {
                        l.loaded = n + x.loaded - r;
                        o.trigger("UploadProgress", l)
                    };
                    u.onreadystatechange = function () {
                        var x;
                        if (u.readyState == 4) {
                            if (u.status == 200) {
                                x = {
                                    chunk: q,
                                    chunks: p,
                                    response: u.responseText,
                                    status: u.status
                                };
                                o.trigger("ChunkUploaded", l, x);
                                if (x.cancelled) {
                                    l.status = b.FAILED;
                                    return
                                }
                                n += w;
                                if (++q >= p) {
                                    l.status = b.DONE;
                                    o.trigger("FileUploaded", l, {
                                        response: u.responseText,
                                        status: u.status
                                    })
                                } else {
                                    j()
                                }
                            } else {
                                o.trigger("Error", {
                                    code: b.HTTP_ERROR,
                                    message: "HTTP Error.",
                                    file: l,
                                    chunk: q,
                                    chunks: p,
                                    status: u.status
                                })
                            }
                        }
                    };
                    if (q < p) {
                        t(c[l.id].slice(q * m, w))
                    }
                }
                j()
            });
            i({
                success: true
            })
        }
    })
})(plupload);
(function (c) {
    var a = {};

    function b(l) {
        var k, j = typeof l,
            h, e, g, f;
        if (j === "string") {
            k = "\bb\tt\nn\ff\rr\"\"''\\\\";
            return '"' + l.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g, function (n, m) {
                var i = k.indexOf(m);
                if (i + 1) {
                    return "\\" + k.charAt(i + 1)
                }
                n = m.charCodeAt().toString(16);
                return "\\u" + "0000".substring(n.length) + n
            }) + '"'
        }
        if (j == "object") {
            e = l.length !== h;
            k = "";
            if (e) {
                for (g = 0; g < l.length; g++) {
                    if (k) {
                        k += ","
                    }
                    k += b(l[g])
                }
                k = "[" + k + "]"
            } else {
                for (f in l) {
                    if (l.hasOwnProperty(f)) {
                        if (k) {
                            k += ","
                        }
                        k += b(f) + ":" + b(l[f])
                    }
                }
                k = "{" + k + "}"
            }
            return k
        }
        if (l === h) {
            return "null"
        }
        return "" + l
    }
    function d(o) {
        var r = false,
            f = null,
            k = null,
            g, h, i, q, j, m = 0;
        try {
            try {
                k = new ActiveXObject("AgControl.AgControl");
                if (k.IsVersionSupported(o)) {
                    r = true
                }
                k = null
            } catch (n) {
                var l = navigator.plugins["Silverlight Plug-In"];
                if (l) {
                    g = l.description;
                    if (g === "1.0.30226.2") {
                        g = "2.0.30226.2"
                    }
                    h = g.split(".");
                    while (h.length > 3) {
                        h.pop()
                    }
                    while (h.length < 4) {
                        h.push(0)
                    }
                    i = o.split(".");
                    while (i.length > 4) {
                        i.pop()
                    }
                    do {
                        q = parseInt(i[m], 10);
                        j = parseInt(h[m], 10);
                        m++
                    } while (m < i.length && q === j);
                    if (q <= j && !isNaN(q)) {
                        r = true
                    }
                }
            }
        } catch (p) {
            r = false
        }
        return r
    }
    c.silverlight = {
        trigger: function (j, f) {
            var h = a[j],
                g, e;
            if (h) {
                e = c.toArray(arguments).slice(1);
                e[0] = "Silverlight:" + f;
                setTimeout(function () {
                    h.trigger.apply(h, e)
                }, 0)
            }
        }
    };
    c.runtimes.Silverlight = c.addRuntime("silverlight", {
        getFeatures: function () {
            return {
                jpgresize: true,
                pngresize: true,
                chunks: true,
                progress: true,
                multipart: true
            }
        },
        init: function (l, m) {
            var k, h = "",
                j = l.settings.filters,
                g, f = document.body;
            if (!d("2.0.31005.0") || (window.opera && window.opera.buildNumber)) {
                m({
                    success: false
                });
                return
            }
            a[l.id] = l;
            k = document.createElement("div");
            k.id = l.id + "_silverlight_container";
            c.extend(k.style, {
                position: "absolute",
                top: "0px",
                background: l.settings.shim_bgcolor || "transparent",
                zIndex: 99999,
                width: "100px",
                height: "100px",
                overflow: "hidden",
                opacity: l.settings.shim_bgcolor ? "" : 0.01
            });
            k.className = "plupload silverlight";
            if (l.settings.container) {
                f = document.getElementById(l.settings.container);
                f.style.position = "relative"
            }
            f.appendChild(k);
            for (g = 0; g < j.length; g++) {
                h += (h != "" ? "|" : "") + j[g].title + " | *." + j[g].extensions.replace(/,/g, ";*.")
            }
            k.innerHTML = '<object id="' + l.id + '_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="' + l.settings.silverlight_xap_url + '"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="initParams" value="id=' + l.id + ",filter=" + h + '"/></object>';

            function e() {
                return document.getElementById(l.id + "_silverlight").content.Upload
            }
            l.bind("Silverlight:Init", function () {
                var i, n = {};
                l.bind("Silverlight:StartSelectFiles", function (o) {
                    i = []
                });
                l.bind("Silverlight:SelectFile", function (o, r, p, q) {
                    var s;
                    s = c.guid();
                    n[s] = r;
                    n[r] = s;
                    i.push(new c.File(s, p, q))
                });
                l.bind("Silverlight:SelectSuccessful", function () {
                    if (i.length) {
                        l.trigger("FilesAdded", i)
                    }
                });
                l.bind("Silverlight:UploadChunkError", function (o, r, p, s, q) {
                    l.trigger("Error", {
                        code: c.IO_ERROR,
                        message: "IO Error.",
                        details: q,
                        file: o.getFile(n[r])
                    })
                });
                l.bind("Silverlight:UploadFileProgress", function (o, s, p, r) {
                    var q = o.getFile(n[s]);
                    if (q.status != c.FAILED) {
                        q.size = r;
                        q.loaded = p;
                        o.trigger("UploadProgress", q)
                    }
                });
                l.bind("Refresh", function (o) {
                    var p, q, r;
                    p = document.getElementById(o.settings.browse_button);
                    q = c.getPos(p, document.getElementById(o.settings.container));
                    r = c.getSize(p);
                    c.extend(document.getElementById(o.id + "_silverlight_container").style, {
                        top: q.y + "px",
                        left: q.x + "px",
                        width: r.w + "px",
                        height: r.h + "px"
                    })
                });
                l.bind("Silverlight:UploadChunkSuccessful", function (o, r, p, u, t) {
                    var s, q = o.getFile(n[r]);
                    s = {
                        chunk: p,
                        chunks: u,
                        response: t
                    };
                    o.trigger("ChunkUploaded", q, s);
                    if (q.status != c.FAILED) {
                        e().UploadNextChunk()
                    }
                    if (p == u - 1) {
                        q.status = c.DONE;
                        o.trigger("FileUploaded", q, {
                            response: t
                        })
                    }
                });
                l.bind("Silverlight:UploadSuccessful", function (o, r, p) {
                    var q = o.getFile(n[r]);
                    q.status = c.DONE;
                    o.trigger("FileUploaded", q, {
                        response: p
                    })
                });
                l.bind("FilesRemoved", function (o, q) {
                    var p;
                    for (p = 0; p < q.length; p++) {
                        e().RemoveFile(n[q[p].id])
                    }
                });
                l.bind("UploadFile", function (o, q) {
                    var r = o.settings,
                        p = r.resize || {};
                    e().UploadFile(n[q.id], c.buildUrl(o.settings.url, {
                        name: q.target_name || q.name
                    }), b({
                        chunk_size: r.chunk_size,
                        image_width: p.width,
                        image_height: p.height,
                        image_quality: p.quality || 90,
                        multipart: !! r.multipart,
                        multipart_params: r.multipart_params || {},
                        headers: r.headers
                    }))
                });
                m({
                    success: true
                })
            })
        }
    })
})(plupload);
(function (c) {
    var a = {};

    function b() {
        var d;
        try {
            d = navigator.plugins["Shockwave Flash"];
            d = d.description
        } catch (f) {
            try {
                d = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")
            } catch (e) {
                d = "0.0"
            }
        }
        d = d.match(/\d+/g);
        return parseFloat(d[0] + "." + d[1])
    }
    c.flash = {
        trigger: function (f, d, e) {
            setTimeout(function () {
                var j = a[f],
                    h, g;
                if (j) {
                    j.trigger("Flash:" + d, e)
                }
            }, 0)
        }
    };
    c.runtimes.Flash = c.addRuntime("flash", {
        getFeatures: function () {
            return {
                jpgresize: true,
                pngresize: true,
                chunks: true,
                progress: true,
                multipart: true
            }
        },
        init: function (g, l) {
            var k, f, h, e, m = 0,
                d = document.body;
            if (b() < 10) {
                l({
                    success: false
                });
                return
            }
            a[g.id] = g;
            k = document.getElementById(g.settings.browse_button);
            f = document.createElement("div");
            f.id = g.id + "_flash_container";
            c.extend(f.style, {
                position: "absolute",
                top: "0px",
                background: g.settings.shim_bgcolor || "transparent",
                zIndex: 99999,
                width: "100%",
                height: "100%"
            });
            f.className = "plupload flash";
            if (g.settings.container) {
                d = document.getElementById(g.settings.container);
                d.style.position = "relative"
            }
            d.appendChild(f);
            h = "id=" + escape(g.id);
            f.innerHTML = '<object id="' + g.id + '_flash" width="100%" height="100%" style="outline:0" type="application/x-shockwave-flash" data="' + g.settings.flash_swf_url + '"><param name="movie" value="' + g.settings.flash_swf_url + '" /><param name="flashvars" value="' + h + '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>';

            function j() {
                return document.getElementById(g.id + "_flash")
            }
            function i() {
                if (m++ > 5000) {
                    l({
                        success: false
                    });
                    return
                }
                if (!e) {
                    setTimeout(i, 1)
                }
            }
            i();
            k = f = null;
            g.bind("Flash:Init", function () {
                var p = {},
                    o, n = g.settings.resize || {};
                e = true;
                j().setFileFilters(g.settings.filters, g.settings.multi_selection);
                g.bind("UploadFile", function (q, r) {
                    var s = q.settings;
                    j().uploadFile(p[r.id], c.buildUrl(s.url, {
                        name: r.target_name || r.name
                    }), {
                        chunk_size: s.chunk_size,
                        width: n.width,
                        height: n.height,
                        quality: n.quality || 90,
                        multipart: s.multipart,
                        multipart_params: s.multipart_params,
                        file_data_name: s.file_data_name,
                        format: /\.(jpg|jpeg)$/i.test(r.name) ? "jpg" : "png",
                        headers: s.headers,
                        urlstream_upload: s.urlstream_upload
                    })
                });
                g.bind("Flash:UploadProcess", function (r, q) {
                    var s = r.getFile(p[q.id]);
                    if (s.status != c.FAILED) {
                        s.loaded = q.loaded;
                        s.size = q.size;
                        r.trigger("UploadProgress", s)
                    }
                });
                g.bind("Flash:UploadChunkComplete", function (q, s) {
                    var t, r = q.getFile(p[s.id]);
                    t = {
                        chunk: s.chunk,
                        chunks: s.chunks,
                        response: s.text
                    };
                    q.trigger("ChunkUploaded", r, t);
                    if (r.status != c.FAILED) {
                        j().uploadNextChunk()
                    }
                    if (s.chunk == s.chunks - 1) {
                        r.status = c.DONE;
                        q.trigger("FileUploaded", r, {
                            response: s.text
                        })
                    }
                });
                g.bind("Flash:SelectFiles", function (q, t) {
                    var s, r, u = [],
                        v;
                    for (r = 0; r < t.length; r++) {
                        s = t[r];
                        v = c.guid();
                        p[v] = s.id;
                        p[s.id] = v;
                        u.push(new c.File(v, s.name, s.size))
                    }
                    if (u.length) {
                        g.trigger("FilesAdded", u)
                    }
                });
                g.bind("Flash:SecurityError", function (q, r) {
                    g.trigger("Error", {
                        code: c.SECURITY_ERROR,
                        message: "Security error.",
                        details: r.message,
                        file: g.getFile(p[r.id])
                    })
                });
                g.bind("Flash:GenericError", function (q, r) {
                    g.trigger("Error", {
                        code: c.GENERIC_ERROR,
                        message: "Generic error.",
                        details: r.message,
                        file: g.getFile(p[r.id])
                    })
                });
                g.bind("Flash:IOError", function (q, r) {
                    g.trigger("Error", {
                        code: c.IO_ERROR,
                        message: "IO error.",
                        details: r.message,
                        file: g.getFile(p[r.id])
                    })
                });
                g.bind("QueueChanged", function (q) {
                    g.refresh()
                });
                g.bind("FilesRemoved", function (q, s) {
                    var r;
                    for (r = 0; r < s.length; r++) {
                        j().removeFile(p[s[r].id])
                    }
                });
                g.bind("StateChanged", function (q) {
                    g.refresh()
                });
                g.bind("Refresh", function (q) {
                    var r, s, t;
                    j().setFileFilters(g.settings.filters, g.settings.multi_selection);
                    r = document.getElementById(q.settings.browse_button);
                    s = c.getPos(r, document.getElementById(q.settings.container));
                    t = c.getSize(r);
                    c.extend(document.getElementById(q.id + "_flash_container").style, {
                        top: s.y + "px",
                        left: s.x + "px",
                        width: t.w + "px",
                        height: t.h + "px"
                    })
                });
                l({
                    success: true
                })
            })
        }
    })
})(plupload);
(function (a) {
    a.runtimes.BrowserPlus = a.addRuntime("browserplus", {
        getFeatures: function () {
            return {
                dragdrop: true,
                jpgresize: true,
                pngresize: true,
                chunks: true,
                progress: true,
                multipart: true
            }
        },
        init: function (g, i) {
            var e = window.BrowserPlus,
                h = {},
                d = g.settings,
                c = d.resize;

            function f(n) {
                var m, l, j = [],
                    k, o;
                for (l = 0; l < n.length; l++) {
                    k = n[l];
                    o = a.guid();
                    h[o] = k;
                    j.push(new a.File(o, k.name, k.size))
                }
                if (l) {
                    g.trigger("FilesAdded", j)
                }
            }
            function b() {
                g.bind("PostInit", function () {
                    var m, k = d.drop_element,
                        o = g.id + "_droptarget",
                        j = document.getElementById(k),
                        l;

                    function p(r, q) {
                        e.DragAndDrop.AddDropTarget({
                            id: r
                        }, function (s) {
                            e.DragAndDrop.AttachCallbacks({
                                id: r,
                                hover: function (t) {
                                    if (!t && q) {
                                        q()
                                    }
                                },
                                drop: function (t) {
                                    if (q) {
                                        q()
                                    }
                                    f(t)
                                }
                            }, function () {})
                        })
                    }
                    function n() {
                        document.getElementById(o).style.top = "-1000px"
                    }
                    if (j) {
                        if (document.attachEvent && (/MSIE/gi).test(navigator.userAgent)) {
                            m = document.createElement("div");
                            m.setAttribute("id", o);
                            a.extend(m.style, {
                                position: "absolute",
                                top: "-1000px",
                                background: "red",
                                filter: "alpha(opacity=0)",
                                opacity: 0
                            });
                            document.body.appendChild(m);
                            a.addEvent(j, "dragenter", function (r) {
                                var q, s;
                                q = document.getElementById(k);
                                s = a.getPos(q);
                                a.extend(document.getElementById(o).style, {
                                    top: s.y + "px",
                                    left: s.x + "px",
                                    width: q.offsetWidth + "px",
                                    height: q.offsetHeight + "px"
                                })
                            });
                            p(o, n)
                        } else {
                            p(k)
                        }
                    }
                    a.addEvent(document.getElementById(d.browse_button), "click", function (v) {
                        var t = [],
                            r, q, u = d.filters,
                            s;
                        v.preventDefault();
                        for (r = 0; r < u.length; r++) {
                            s = u[r].extensions.split(",");
                            for (q = 0; q < s.length; q++) {
                                t.push(a.mimeTypes[s[q]])
                            }
                        }
                        e.FileBrowse.OpenBrowseDialog({
                            mimeTypes: t
                        }, function (w) {
                            if (w.success) {
                                f(w.value)
                            }
                        })
                    });
                    j = m = null
                });
                g.bind("UploadFile", function (n, k) {
                    var m = h[k.id],
                        j = {},
                        l = n.settings.chunk_size,
                        o, p = [];

                    function r(s, u) {
                        var t;
                        if (k.status == a.FAILED) {
                            return
                        }
                        j.name = k.target_name || k.name;
                        if (l) {
                            j.chunk = s;
                            j.chunks = u
                        }
                        t = p.shift();
                        e.Uploader.upload({
                            url: a.buildUrl(n.settings.url, j),
                            files: {
                                file: t
                            },
                            cookies: document.cookies,
                            postvars: n.settings.multipart_params,
                            progressCallback: function (x) {
                                var w, v = 0;
                                o[s] = parseInt(x.filePercent * t.size / 100, 10);
                                for (w = 0; w < o.length; w++) {
                                    v += o[w]
                                }
                                k.loaded = v;
                                n.trigger("UploadProgress", k)
                            }
                        }, function (w) {
                            var v, x;
                            if (w.success) {
                                v = w.value.statusCode;
                                if (l) {
                                    n.trigger("ChunkUploaded", k, {
                                        chunk: s,
                                        chunks: u,
                                        response: w.value.body,
                                        status: v
                                    })
                                }
                                if (p.length > 0) {
                                    r(++s, u)
                                } else {
                                    k.status = a.DONE;
                                    n.trigger("FileUploaded", k, {
                                        response: w.value.body,
                                        status: v
                                    });
                                    if (v >= 400) {
                                        n.trigger("Error", {
                                            code: a.HTTP_ERROR,
                                            message: "HTTP Error.",
                                            file: k,
                                            status: v
                                        })
                                    }
                                }
                            } else {
                                n.trigger("Error", {
                                    code: a.GENERIC_ERROR,
                                    message: "Generic Error.",
                                    file: k,
                                    details: w.error
                                })
                            }
                        })
                    }
                    function q(s) {
                        k.size = s.size;
                        if (l) {
                            e.FileAccess.chunk({
                                file: s,
                                chunkSize: l
                            }, function (v) {
                                if (v.success) {
                                    var w = v.value,
                                        t = w.length;
                                    o = Array(t);
                                    for (var u = 0; u < t; u++) {
                                        o[u] = 0;
                                        p.push(w[u])
                                    }
                                    r(0, t)
                                }
                            })
                        } else {
                            o = Array(1);
                            p.push(s);
                            r(0, 1)
                        }
                    }
                    if (c && /\.(png|jpg|jpeg)$/i.test(k.name)) {
                        BrowserPlus.ImageAlter.transform({
                            file: m,
                            quality: c.quality || 90,
                            actions: [{
                                scale: {
                                    maxwidth: c.width,
                                    maxheight: c.height
                                }
                            }]
                        }, function (s) {
                            if (s.success) {
                                q(s.value.file)
                            }
                        })
                    } else {
                        q(m)
                    }
                });
                i({
                    success: true
                })
            }
            if (e) {
                e.init(function (k) {
                    var j = [{
                        service: "Uploader",
                        version: "3"
                    },
                    {
                        service: "DragAndDrop",
                        version: "1"
                    },
                    {
                        service: "FileBrowse",
                        version: "1"
                    },
                    {
                        service: "FileAccess",
                        version: "2"
                    }];
                    if (c) {
                        j.push({
                            service: "ImageAlter",
                            version: "4"
                        })
                    }
                    if (k.success) {
                        e.require({
                            services: j
                        }, function (l) {
                            if (l.success) {
                                b()
                            } else {
                                i()
                            }
                        })
                    } else {
                        i()
                    }
                })
            } else {
                i()
            }
        }
    })
})(plupload);
(function (b) {
    function a(i, l, j, c, k) {
        var e, d, h, g, f;
        e = document.createElement("canvas");
        e.style.display = "none";
        document.body.appendChild(e);
        d = e.getContext("2d");
        h = new Image();
        h.onload = function () {
            var o, m, n;
            f = Math.min(l / h.width, j / h.height);
            if (f < 1) {
                o = Math.round(h.width * f);
                m = Math.round(h.height * f)
            } else {
                o = h.width;
                m = h.height
            }
            e.width = o;
            e.height = m;
            d.drawImage(h, 0, 0, o, m);
            g = e.toDataURL(c);
            g = g.substring(g.indexOf("base64,") + 7);
            g = atob(g);
            e.parentNode.removeChild(e);
            k({
                success: true,
                data: g
            })
        };
        h.src = i
    }
    b.runtimes.Html5 = b.addRuntime("html5", {
        getFeatures: function () {
            var g, d, f, e, c;
            d = f = e = c = false;
            if (window.XMLHttpRequest) {
                g = new XMLHttpRequest();
                f = !! g.upload;
                d = !! (g.sendAsBinary || g.upload)
            }
            if (d) {
                e = !! (File && File.prototype.getAsDataURL);
                c = !! (File && File.prototype.slice)
            }
            return {
                html5: d,
                dragdrop: window.mozInnerScreenX !== undefined || c,
                jpgresize: e,
                pngresize: e,
                multipart: e || !! window.FileReader || !! window.FormData,
                progress: f,
                chunking: c || e
            }
        },
        init: function (f, g) {
            var c = {},
                d;

            function e(l) {
                var j, h, k = [],
                    m;
                for (h = 0; h < l.length; h++) {
                    j = l[h];
                    m = b.guid();
                    c[m] = j;
                    k.push(new b.File(m, j.fileName, j.fileSize))
                }
                if (k.length) {
                    f.trigger("FilesAdded", k)
                }
            }
            d = this.getFeatures();
            if (!d.html5) {
                g({
                    success: false
                });
                return
            }
            f.bind("Init", function (m) {
                var q, o = [],
                    l, p, j = m.settings.filters,
                    k, n, h = document.body;
                q = document.createElement("div");
                q.id = m.id + "_html5_container";
                for (l = 0; l < j.length; l++) {
                    k = j[l].extensions.split(/,/);
                    for (p = 0; p < k.length; p++) {
                        n = b.mimeTypes[k[p]];
                        if (n) {
                            o.push(n)
                        }
                    }
                }
                b.extend(q.style, {
                    position: "absolute",
                    background: f.settings.shim_bgcolor || "transparent",
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    zIndex: 99999,
                    opacity: f.settings.shim_bgcolor ? "" : 0
                });
                q.className = "plupload html5";
                if (f.settings.container) {
                    h = document.getElementById(f.settings.container);
                    h.style.position = "relative"
                }
                h.appendChild(q);
                q.innerHTML = '<input id="' + f.id + '_html5" style="width:100%;" type="file" accept="' + o.join(",") + '" ' + (f.settings.multi_selection ? 'multiple="multiple"' : "") + " />";
                document.getElementById(f.id + "_html5").onchange = function () {
                    e(this.files);
                    this.value = ""
                }
            });
            f.bind("PostInit", function () {
                var h = document.getElementById(f.settings.drop_element);
                if (h) {
                    b.addEvent(h, "dragover", function (i) {
                        i.preventDefault()
                    });
                    b.addEvent(h, "drop", function (j) {
                        var i = j.dataTransfer;
                        if (i && i.files) {
                            e(i.files)
                        }
                        j.preventDefault()
                    })
                }
            });
            f.bind("Refresh", function (h) {
                var i, j, k;
                i = document.getElementById(f.settings.browse_button);
                j = b.getPos(i, document.getElementById(h.settings.container));
                k = b.getSize(i);
                b.extend(document.getElementById(f.id + "_html5_container").style, {
                    top: j.y + "px",
                    left: j.x + "px",
                    width: k.w + "px",
                    height: k.h + "px"
                })
            });
            f.bind("UploadFile", function (h, j) {
                var k = h.settings,
                    m, i;

                function l(n) {
                    var q = 0,
                        p = 0;

                    function o() {
                        var u = n,
                            C, D, y, z, A = 0,
                            r = "----pluploadboundary" + b.guid(),
                            t, w, s = "--",
                            B = "\r\n",
                            x = "";
                        if (j.status == b.DONE || j.status == b.FAILED || h.state == b.STOPPED) {
                            return
                        }
                        z = {
                            name: j.target_name || j.name
                        };
                        if (k.chunk_size && d.chunking) {
                            t = k.chunk_size;
                            y = Math.ceil(j.size / t);
                            w = Math.min(t, j.size - (q * t));
                            if (typeof(n) == "string") {
                                u = n.substring(q * t, q * t + w)
                            } else {
                                u = n.slice(q * t, w)
                            }
                            z.chunk = q;
                            z.chunks = y
                        } else {
                            w = j.size
                        }
                        C = new XMLHttpRequest();
                        D = C.upload;
                        if (D) {
                            D.onprogress = function (E) {
                                j.loaded = Math.min(j.size, p + E.loaded - A);
                                h.trigger("UploadProgress", j)
                            }
                        }
                        C.open("post", b.buildUrl(h.settings.url, z), true);
                        C.onreadystatechange = function () {
                            var E, G;
                            if (C.readyState == 4) {
                                try {
                                    E = C.status
                                } catch (F) {
                                    E = 0
                                }
                                if (E >= 400) {
                                    h.trigger("Error", {
                                        code: b.HTTP_ERROR,
                                        message: "HTTP Error.",
                                        file: j,
                                        status: E
                                    })
                                } else {
                                    if (y) {
                                        G = {
                                            chunk: q,
                                            chunks: y,
                                            response: C.responseText,
                                            status: E
                                        };
                                        h.trigger("ChunkUploaded", j, G);
                                        p += w;
                                        if (G.cancelled) {
                                            j.status = b.FAILED;
                                            return
                                        }
                                        j.loaded = Math.min(j.size, (q + 1) * t)
                                    } else {
                                        j.loaded = j.size
                                    }
                                    h.trigger("UploadProgress", j);
                                    if (!y || ++q >= y) {
                                        j.status = b.DONE;
                                        h.trigger("FileUploaded", j, {
                                            response: C.responseText,
                                            status: E
                                        })
                                    } else {
                                        o()
                                    }
                                }
                            }
                        };
                        b.each(h.settings.headers, function (F, E) {
                            C.setRequestHeader(E, F)
                        });
                        if (h.settings.multipart && d.multipart) {
                            if (!C.sendAsBinary) {
                                var v = new FormData();
                                b.each(h.settings.multipart_params, function (F, E) {
                                    v.append(E, F)
                                });
                                v.append(h.settings.file_data_name, u);
                                C.send(v);
                                return
                            }
                            C.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + r);
                            b.each(h.settings.multipart_params, function (F, E) {
                                x += s + r + B + 'Content-Disposition: form-data; name="' + E + '"' + B + B;
                                x += F + B
                            });
                            x += s + r + B + 'Content-Disposition: form-data; name="' + h.settings.file_data_name + '"; filename="' + j.name + '"' + B + "Content-Type: application/octet-stream" + B + B + u + B + s + r + s + B;
                            A = x.length - u.length;
                            u = x
                        } else {
                            C.setRequestHeader("Content-Type", "application/octet-stream")
                        }
                        if (C.sendAsBinary) {
                            C.sendAsBinary(u)
                        } else {
                            C.send(u)
                        }
                    }
                    o()
                }
                m = c[j.id];
                i = h.settings.resize;
                if (d.jpgresize) {
                    if (i && /\.(png|jpg|jpeg)$/i.test(j.name)) {
                        a(m.getAsDataURL(), i.width, i.height, /\.png$/i.test(j.name) ? "image/png" : "image/jpeg", function (n) {
                            if (n.success) {
                                j.size = n.data.length;
                                l(n.data)
                            } else {
                                l(m.getAsBinary())
                            }
                        })
                    } else {
                        l(m.getAsBinary())
                    }
                } else {
                    l(m)
                }
            });
            g({
                success: true
            })
        }
    })
})(plupload);
(function (a) {
    a.runtimes.Html4 = a.addRuntime("html4", {
        getFeatures: function () {
            return {
                multipart: true
            }
        },
        init: function (f, g) {
            var d = {},
                c, b;

            function e(l) {
                var k, j, m = [],
                    n, h;
                h = l.value.replace(/\\/g, "/");
                h = h.substring(h.length, h.lastIndexOf("/") + 1);
                n = a.guid();
                k = new a.File(n, h);
                d[n] = k;
                k.input = l;
                m.push(k);
                if (m.length) {
                    f.trigger("FilesAdded", m)
                }
            }
            f.bind("Init", function (p) {
                var h, x, v, t = [],
                    o, u, m = p.settings.filters,
                    l, s, r = /MSIE/.test(navigator.userAgent),
                    k = "javascript",
                    w, j = document.body,
                    n;
                if (f.settings.container) {
                    j = document.getElementById(f.settings.container);
                    j.style.position = "relative"
                }
                c = (typeof p.settings.form == "string") ? document.getElementById(p.settings.form) : p.settings.form;
                if (!c) {
                    n = document.getElementById(f.settings.browse_button);
                    for (; n; n = n.parentNode) {
                        if (n.nodeName == "FORM") {
                            c = n
                        }
                    }
                }
                if (!c) {
                    c = document.createElement("form");
                    c.style.display = "inline";
                    n = document.getElementById(f.settings.container);
                    n.parentNode.insertBefore(c, n);
                    c.appendChild(n)
                }
                c.setAttribute("method", "post");
                c.setAttribute("enctype", "multipart/form-data");
                a.each(p.settings.multipart_params, function (z, y) {
                    var i = document.createElement("input");
                    a.extend(i, {
                        type: "hidden",
                        name: y,
                        value: z
                    });
                    c.appendChild(i)
                });
                b = document.createElement("iframe");
                b.setAttribute("src", k + ':""');
                b.setAttribute("name", p.id + "_iframe");
                b.setAttribute("id", p.id + "_iframe");
                b.style.display = "none";
                a.addEvent(b, "load", function (B) {
                    var C = B.target,
                        z = f.currentfile,
                        A;
                    try {
                        A = C.contentWindow.document || C.contentDocument || window.frames[C.id].document
                    } catch (y) {
                        p.trigger("Error", {
                            code: a.SECURITY_ERROR,
                            message: "Security error.",
                            file: z
                        });
                        return
                    }
                    if (A.location.href == "about:blank" || !z) {
                        return
                    }
                    var i = A.documentElement.innerText || A.documentElement.textContent;
                    if (i != "") {
                        z.status = a.DONE;
                        z.loaded = 1025;
                        z.percent = 100;
                        if (z.input) {
                            z.input.removeAttribute("name")
                        }
                        p.trigger("UploadProgress", z);
                        p.trigger("FileUploaded", z, {
                            response: i
                        });
                        if (c.tmpAction) {
                            c.setAttribute("action", c.tmpAction)
                        }
                        if (c.tmpTarget) {
                            c.setAttribute("target", c.tmpTarget)
                        }
                    }
                });
                c.appendChild(b);
                if (r) {
                    window.frames[b.id].name = b.name
                }
                x = document.createElement("div");
                x.id = p.id + "_iframe_container";
                for (o = 0; o < m.length; o++) {
                    l = m[o].extensions.split(/,/);
                    for (u = 0; u < l.length; u++) {
                        s = a.mimeTypes[l[u]];
                        if (s) {
                            t.push(s)
                        }
                    }
                }
                a.extend(x.style, {
                    position: "absolute",
                    background: "transparent",
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    zIndex: 99999,
                    opacity: 0
                });
                w = f.settings.shim_bgcolor;
                if (w) {
                    a.extend(x.style, {
                        background: w,
                        opacity: 1
                    })
                }
                x.className = "plupload_iframe";
                j.appendChild(x);

                function q() {
                    v = document.createElement("input");
                    v.setAttribute("type", "file");
                    v.setAttribute("accept", t.join(","));
                    v.setAttribute("size", 1);
                    a.extend(v.style, {
                        width: "100%",
                        height: "100%",
                        opacity: 0
                    });
                    if (r) {
                        a.extend(v.style, {
                            filter: "alpha(opacity=0)"
                        })
                    }
                    a.addEvent(v, "change", function (i) {
                        var y = i.target;
                        if (y.value) {
                            q();
                            y.style.display = "none";
                            e(y)
                        }
                    });
                    x.appendChild(v);
                    return true
                }
                q()
            });
            f.bind("Refresh", function (h) {
                var i, j, k;
                i = document.getElementById(f.settings.browse_button);
                j = a.getPos(i, document.getElementById(h.settings.container));
                k = a.getSize(i);
                a.extend(document.getElementById(f.id + "_iframe_container").style, {
                    top: j.y + "px",
                    left: j.x + "px",
                    width: k.w + "px",
                    height: k.h + "px"
                })
            });
            f.bind("UploadFile", function (h, i) {
                if (i.status == a.DONE || i.status == a.FAILED || h.state == a.STOPPED) {
                    return
                }
                if (!i.input) {
                    i.status = a.ERROR;
                    return
                }
                i.input.setAttribute("name", h.settings.file_data_name);
                c.tmpAction = c.getAttribute("action");
                c.setAttribute("action", a.buildUrl(h.settings.url, {
                    name: i.target_name || i.name
                }));
                c.tmpTarget = c.getAttribute("target");
                c.setAttribute("target", b.name);
                this.currentfile = i;
                c.submit()
            });
            f.bind("FilesRemoved", function (h, k) {
                var j, l;
                for (j = 0; j < k.length; j++) {
                    l = k[j].input;
                    if (l) {
                        l.parentNode.removeChild(l)
                    }
                }
            });
            g({
                success: true
            })
        }
    })
})(plupload);