import 'string-width';
import { M as Mime_1, s as standard, g as getDefaultExportFromCjs } from './chunks/pages/generic_7b35b255.mjs';
import { A as AstroError, w as ResponseSentError, D as MiddlewareNoDataOrNextCalled, G as MiddlewareNotAResponse, H as GetStaticPathsRequired, J as InvalidGetStaticPathsReturn, K as InvalidGetStaticPathsEntry, N as GetStaticPathsExpectedParams, O as GetStaticPathsInvalidRouteParam, P as PageNumberParamNotFound, Q as GetStaticPathsRemovedRSSHelper, T as NoMatchingStaticPathFound, V as PrerenderDynamicEndpointPathCollide, W as LocalsNotAnObject, X as ASTRO_VERSION, C as ClientAddressNotAvailable, S as StaticClientAddressNotAvailable, Y as renderEndpoint } from './chunks/astro_5fcc4e68.mjs';
import { t as trimSlashes } from './chunks/astro/assets-service_78ae96de.mjs';

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse$1;
var serialize_1 = serialize;

/**
 * Module variables.
 * @private
 */

var __toString = Object.prototype.toString;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse$1(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var dec = opt.decode || decode;

  var index = 0;
  while (index < str.length) {
    var eqIdx = str.indexOf('=', index);

    // no more cookie pairs
    if (eqIdx === -1) {
      break
    }

    var endIdx = str.indexOf(';', index);

    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(';', eqIdx - 1) + 1;
      continue
    }

    var key = str.slice(index, eqIdx).trim();

    // only assign once
    if (undefined === obj[key]) {
      var val = str.slice(eqIdx + 1, endIdx).trim();

      // quoted values
      if (val.charCodeAt(0) === 0x22) {
        val = val.slice(1, -1);
      }

      obj[key] = tryDecode(val, dec);
    }

    index = endIdx + 1;
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    var expires = opt.expires;

    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.priority) {
    var priority = typeof opt.priority === 'string'
      ? opt.priority.toLowerCase()
      : opt.priority;

    switch (priority) {
      case 'low':
        str += '; Priority=Low';
        break
      case 'medium':
        str += '; Priority=Medium';
        break
      case 'high':
        str += '; Priority=High';
        break
      default:
        throw new TypeError('option priority is invalid')
    }
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */

function decode (str) {
  return str.indexOf('%') !== -1
    ? decodeURIComponent(str)
    : str
}

/**
 * URL-encode value.
 *
 * @param {string} str
 * @returns {string}
 */

function encode (val) {
  return encodeURIComponent(val)
}

/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */

function isDate (val) {
  return __toString.call(val) === '[object Date]' ||
    val instanceof Date
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = Symbol.for("astro.responseSent");
class AstroCookie {
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false")
      return false;
    if (this.value === "0")
      return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const serializeOptions = {
      expires: DELETED_EXPIRATION
    };
    if (options?.domain) {
      serializeOptions.domain = options.domain;
    }
    if (options?.path) {
      serializeOptions.path = options.path;
    }
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      serialize_1(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const values = this.#ensureParsed();
    if (key in values) {
      const value = values[key];
      return new AstroCookie(value);
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @returns
   */
  has(key) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed();
    return !!values[key];
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      serialize_1(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null)
      return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  #ensureParsed() {
    if (!this.#requestValues) {
      this.#parse();
    }
    if (!this.#requestValues) {
      this.#requestValues = {};
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse() {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = parse_1(raw);
  }
}

const astroCookiesSymbol = Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function responseHasCookies(response) {
  return Reflect.has(response, astroCookiesSymbol);
}
function getFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of cookies.headers()) {
    yield headerValue;
  }
  return [];
}

let FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, isTTY=true;
if (typeof process !== 'undefined') {
	({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
	isTTY = process.stdout && process.stdout.isTTY;
}

const $ = {
	enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== 'dumb' && (
		FORCE_COLOR != null && FORCE_COLOR !== '0' || isTTY
	)
};

function init(x, y) {
	let rgx = new RegExp(`\\x1b\\[${y}m`, 'g');
	let open = `\x1b[${x}m`, close = `\x1b[${y}m`;

	return function (txt) {
		if (!$.enabled || txt == null) return txt;
		return open + (!!~(''+txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
	};
}

// modifiers
const reset = init(0, 0);
const bold = init(1, 22);
const dim = init(2, 22);
const red = init(31, 39);
const yellow = init(33, 39);
const cyan = init(36, 39);

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit"
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message
  };
  if (levels[logLevel] > levels[level]) {
    return;
  }
  dest.write(event);
}
function info(opts, label, message) {
  return log(opts, "info", label, message);
}
function warn(opts, label, message) {
  return log(opts, "warn", label, message);
}
function error(opts, label, message) {
  return log(opts, "error", label, message);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message) {
    info(this.options, label, message);
  }
  warn(label, message) {
    warn(this.options, label, message);
  }
  error(label, message) {
    error(this.options, label, message);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

var other = {"application/prs.cww":["cww"],"application/vnd.1000minds.decision-model+xml":["1km"],"application/vnd.3gpp.pic-bw-large":["plb"],"application/vnd.3gpp.pic-bw-small":["psb"],"application/vnd.3gpp.pic-bw-var":["pvb"],"application/vnd.3gpp2.tcap":["tcap"],"application/vnd.3m.post-it-notes":["pwn"],"application/vnd.accpac.simply.aso":["aso"],"application/vnd.accpac.simply.imp":["imp"],"application/vnd.acucobol":["acu"],"application/vnd.acucorp":["atc","acutc"],"application/vnd.adobe.air-application-installer-package+zip":["air"],"application/vnd.adobe.formscentral.fcdt":["fcdt"],"application/vnd.adobe.fxp":["fxp","fxpl"],"application/vnd.adobe.xdp+xml":["xdp"],"application/vnd.adobe.xfdf":["xfdf"],"application/vnd.ahead.space":["ahead"],"application/vnd.airzip.filesecure.azf":["azf"],"application/vnd.airzip.filesecure.azs":["azs"],"application/vnd.amazon.ebook":["azw"],"application/vnd.americandynamics.acc":["acc"],"application/vnd.amiga.ami":["ami"],"application/vnd.android.package-archive":["apk"],"application/vnd.anser-web-certificate-issue-initiation":["cii"],"application/vnd.anser-web-funds-transfer-initiation":["fti"],"application/vnd.antix.game-component":["atx"],"application/vnd.apple.installer+xml":["mpkg"],"application/vnd.apple.keynote":["key"],"application/vnd.apple.mpegurl":["m3u8"],"application/vnd.apple.numbers":["numbers"],"application/vnd.apple.pages":["pages"],"application/vnd.apple.pkpass":["pkpass"],"application/vnd.aristanetworks.swi":["swi"],"application/vnd.astraea-software.iota":["iota"],"application/vnd.audiograph":["aep"],"application/vnd.balsamiq.bmml+xml":["bmml"],"application/vnd.blueice.multipass":["mpm"],"application/vnd.bmi":["bmi"],"application/vnd.businessobjects":["rep"],"application/vnd.chemdraw+xml":["cdxml"],"application/vnd.chipnuts.karaoke-mmd":["mmd"],"application/vnd.cinderella":["cdy"],"application/vnd.citationstyles.style+xml":["csl"],"application/vnd.claymore":["cla"],"application/vnd.cloanto.rp9":["rp9"],"application/vnd.clonk.c4group":["c4g","c4d","c4f","c4p","c4u"],"application/vnd.cluetrust.cartomobile-config":["c11amc"],"application/vnd.cluetrust.cartomobile-config-pkg":["c11amz"],"application/vnd.commonspace":["csp"],"application/vnd.contact.cmsg":["cdbcmsg"],"application/vnd.cosmocaller":["cmc"],"application/vnd.crick.clicker":["clkx"],"application/vnd.crick.clicker.keyboard":["clkk"],"application/vnd.crick.clicker.palette":["clkp"],"application/vnd.crick.clicker.template":["clkt"],"application/vnd.crick.clicker.wordbank":["clkw"],"application/vnd.criticaltools.wbs+xml":["wbs"],"application/vnd.ctc-posml":["pml"],"application/vnd.cups-ppd":["ppd"],"application/vnd.curl.car":["car"],"application/vnd.curl.pcurl":["pcurl"],"application/vnd.dart":["dart"],"application/vnd.data-vision.rdz":["rdz"],"application/vnd.dbf":["dbf"],"application/vnd.dece.data":["uvf","uvvf","uvd","uvvd"],"application/vnd.dece.ttml+xml":["uvt","uvvt"],"application/vnd.dece.unspecified":["uvx","uvvx"],"application/vnd.dece.zip":["uvz","uvvz"],"application/vnd.denovo.fcselayout-link":["fe_launch"],"application/vnd.dna":["dna"],"application/vnd.dolby.mlp":["mlp"],"application/vnd.dpgraph":["dpg"],"application/vnd.dreamfactory":["dfac"],"application/vnd.ds-keypoint":["kpxx"],"application/vnd.dvb.ait":["ait"],"application/vnd.dvb.service":["svc"],"application/vnd.dynageo":["geo"],"application/vnd.ecowin.chart":["mag"],"application/vnd.enliven":["nml"],"application/vnd.epson.esf":["esf"],"application/vnd.epson.msf":["msf"],"application/vnd.epson.quickanime":["qam"],"application/vnd.epson.salt":["slt"],"application/vnd.epson.ssf":["ssf"],"application/vnd.eszigno3+xml":["es3","et3"],"application/vnd.ezpix-album":["ez2"],"application/vnd.ezpix-package":["ez3"],"application/vnd.fdf":["fdf"],"application/vnd.fdsn.mseed":["mseed"],"application/vnd.fdsn.seed":["seed","dataless"],"application/vnd.flographit":["gph"],"application/vnd.fluxtime.clip":["ftc"],"application/vnd.framemaker":["fm","frame","maker","book"],"application/vnd.frogans.fnc":["fnc"],"application/vnd.frogans.ltf":["ltf"],"application/vnd.fsc.weblaunch":["fsc"],"application/vnd.fujitsu.oasys":["oas"],"application/vnd.fujitsu.oasys2":["oa2"],"application/vnd.fujitsu.oasys3":["oa3"],"application/vnd.fujitsu.oasysgp":["fg5"],"application/vnd.fujitsu.oasysprs":["bh2"],"application/vnd.fujixerox.ddd":["ddd"],"application/vnd.fujixerox.docuworks":["xdw"],"application/vnd.fujixerox.docuworks.binder":["xbd"],"application/vnd.fuzzysheet":["fzs"],"application/vnd.genomatix.tuxedo":["txd"],"application/vnd.geogebra.file":["ggb"],"application/vnd.geogebra.tool":["ggt"],"application/vnd.geometry-explorer":["gex","gre"],"application/vnd.geonext":["gxt"],"application/vnd.geoplan":["g2w"],"application/vnd.geospace":["g3w"],"application/vnd.gmx":["gmx"],"application/vnd.google-apps.document":["gdoc"],"application/vnd.google-apps.presentation":["gslides"],"application/vnd.google-apps.spreadsheet":["gsheet"],"application/vnd.google-earth.kml+xml":["kml"],"application/vnd.google-earth.kmz":["kmz"],"application/vnd.grafeq":["gqf","gqs"],"application/vnd.groove-account":["gac"],"application/vnd.groove-help":["ghf"],"application/vnd.groove-identity-message":["gim"],"application/vnd.groove-injector":["grv"],"application/vnd.groove-tool-message":["gtm"],"application/vnd.groove-tool-template":["tpl"],"application/vnd.groove-vcard":["vcg"],"application/vnd.hal+xml":["hal"],"application/vnd.handheld-entertainment+xml":["zmm"],"application/vnd.hbci":["hbci"],"application/vnd.hhe.lesson-player":["les"],"application/vnd.hp-hpgl":["hpgl"],"application/vnd.hp-hpid":["hpid"],"application/vnd.hp-hps":["hps"],"application/vnd.hp-jlyt":["jlt"],"application/vnd.hp-pcl":["pcl"],"application/vnd.hp-pclxl":["pclxl"],"application/vnd.hydrostatix.sof-data":["sfd-hdstx"],"application/vnd.ibm.minipay":["mpy"],"application/vnd.ibm.modcap":["afp","listafp","list3820"],"application/vnd.ibm.rights-management":["irm"],"application/vnd.ibm.secure-container":["sc"],"application/vnd.iccprofile":["icc","icm"],"application/vnd.igloader":["igl"],"application/vnd.immervision-ivp":["ivp"],"application/vnd.immervision-ivu":["ivu"],"application/vnd.insors.igm":["igm"],"application/vnd.intercon.formnet":["xpw","xpx"],"application/vnd.intergeo":["i2g"],"application/vnd.intu.qbo":["qbo"],"application/vnd.intu.qfx":["qfx"],"application/vnd.ipunplugged.rcprofile":["rcprofile"],"application/vnd.irepository.package+xml":["irp"],"application/vnd.is-xpr":["xpr"],"application/vnd.isac.fcs":["fcs"],"application/vnd.jam":["jam"],"application/vnd.jcp.javame.midlet-rms":["rms"],"application/vnd.jisp":["jisp"],"application/vnd.joost.joda-archive":["joda"],"application/vnd.kahootz":["ktz","ktr"],"application/vnd.kde.karbon":["karbon"],"application/vnd.kde.kchart":["chrt"],"application/vnd.kde.kformula":["kfo"],"application/vnd.kde.kivio":["flw"],"application/vnd.kde.kontour":["kon"],"application/vnd.kde.kpresenter":["kpr","kpt"],"application/vnd.kde.kspread":["ksp"],"application/vnd.kde.kword":["kwd","kwt"],"application/vnd.kenameaapp":["htke"],"application/vnd.kidspiration":["kia"],"application/vnd.kinar":["kne","knp"],"application/vnd.koan":["skp","skd","skt","skm"],"application/vnd.kodak-descriptor":["sse"],"application/vnd.las.las+xml":["lasxml"],"application/vnd.llamagraphics.life-balance.desktop":["lbd"],"application/vnd.llamagraphics.life-balance.exchange+xml":["lbe"],"application/vnd.lotus-1-2-3":["123"],"application/vnd.lotus-approach":["apr"],"application/vnd.lotus-freelance":["pre"],"application/vnd.lotus-notes":["nsf"],"application/vnd.lotus-organizer":["org"],"application/vnd.lotus-screencam":["scm"],"application/vnd.lotus-wordpro":["lwp"],"application/vnd.macports.portpkg":["portpkg"],"application/vnd.mapbox-vector-tile":["mvt"],"application/vnd.mcd":["mcd"],"application/vnd.medcalcdata":["mc1"],"application/vnd.mediastation.cdkey":["cdkey"],"application/vnd.mfer":["mwf"],"application/vnd.mfmp":["mfm"],"application/vnd.micrografx.flo":["flo"],"application/vnd.micrografx.igx":["igx"],"application/vnd.mif":["mif"],"application/vnd.mobius.daf":["daf"],"application/vnd.mobius.dis":["dis"],"application/vnd.mobius.mbk":["mbk"],"application/vnd.mobius.mqy":["mqy"],"application/vnd.mobius.msl":["msl"],"application/vnd.mobius.plc":["plc"],"application/vnd.mobius.txf":["txf"],"application/vnd.mophun.application":["mpn"],"application/vnd.mophun.certificate":["mpc"],"application/vnd.mozilla.xul+xml":["xul"],"application/vnd.ms-artgalry":["cil"],"application/vnd.ms-cab-compressed":["cab"],"application/vnd.ms-excel":["xls","xlm","xla","xlc","xlt","xlw"],"application/vnd.ms-excel.addin.macroenabled.12":["xlam"],"application/vnd.ms-excel.sheet.binary.macroenabled.12":["xlsb"],"application/vnd.ms-excel.sheet.macroenabled.12":["xlsm"],"application/vnd.ms-excel.template.macroenabled.12":["xltm"],"application/vnd.ms-fontobject":["eot"],"application/vnd.ms-htmlhelp":["chm"],"application/vnd.ms-ims":["ims"],"application/vnd.ms-lrm":["lrm"],"application/vnd.ms-officetheme":["thmx"],"application/vnd.ms-outlook":["msg"],"application/vnd.ms-pki.seccat":["cat"],"application/vnd.ms-pki.stl":["*stl"],"application/vnd.ms-powerpoint":["ppt","pps","pot"],"application/vnd.ms-powerpoint.addin.macroenabled.12":["ppam"],"application/vnd.ms-powerpoint.presentation.macroenabled.12":["pptm"],"application/vnd.ms-powerpoint.slide.macroenabled.12":["sldm"],"application/vnd.ms-powerpoint.slideshow.macroenabled.12":["ppsm"],"application/vnd.ms-powerpoint.template.macroenabled.12":["potm"],"application/vnd.ms-project":["mpp","mpt"],"application/vnd.ms-word.document.macroenabled.12":["docm"],"application/vnd.ms-word.template.macroenabled.12":["dotm"],"application/vnd.ms-works":["wps","wks","wcm","wdb"],"application/vnd.ms-wpl":["wpl"],"application/vnd.ms-xpsdocument":["xps"],"application/vnd.mseq":["mseq"],"application/vnd.musician":["mus"],"application/vnd.muvee.style":["msty"],"application/vnd.mynfc":["taglet"],"application/vnd.neurolanguage.nlu":["nlu"],"application/vnd.nitf":["ntf","nitf"],"application/vnd.noblenet-directory":["nnd"],"application/vnd.noblenet-sealer":["nns"],"application/vnd.noblenet-web":["nnw"],"application/vnd.nokia.n-gage.ac+xml":["*ac"],"application/vnd.nokia.n-gage.data":["ngdat"],"application/vnd.nokia.n-gage.symbian.install":["n-gage"],"application/vnd.nokia.radio-preset":["rpst"],"application/vnd.nokia.radio-presets":["rpss"],"application/vnd.novadigm.edm":["edm"],"application/vnd.novadigm.edx":["edx"],"application/vnd.novadigm.ext":["ext"],"application/vnd.oasis.opendocument.chart":["odc"],"application/vnd.oasis.opendocument.chart-template":["otc"],"application/vnd.oasis.opendocument.database":["odb"],"application/vnd.oasis.opendocument.formula":["odf"],"application/vnd.oasis.opendocument.formula-template":["odft"],"application/vnd.oasis.opendocument.graphics":["odg"],"application/vnd.oasis.opendocument.graphics-template":["otg"],"application/vnd.oasis.opendocument.image":["odi"],"application/vnd.oasis.opendocument.image-template":["oti"],"application/vnd.oasis.opendocument.presentation":["odp"],"application/vnd.oasis.opendocument.presentation-template":["otp"],"application/vnd.oasis.opendocument.spreadsheet":["ods"],"application/vnd.oasis.opendocument.spreadsheet-template":["ots"],"application/vnd.oasis.opendocument.text":["odt"],"application/vnd.oasis.opendocument.text-master":["odm"],"application/vnd.oasis.opendocument.text-template":["ott"],"application/vnd.oasis.opendocument.text-web":["oth"],"application/vnd.olpc-sugar":["xo"],"application/vnd.oma.dd2+xml":["dd2"],"application/vnd.openblox.game+xml":["obgx"],"application/vnd.openofficeorg.extension":["oxt"],"application/vnd.openstreetmap.data+xml":["osm"],"application/vnd.openxmlformats-officedocument.presentationml.presentation":["pptx"],"application/vnd.openxmlformats-officedocument.presentationml.slide":["sldx"],"application/vnd.openxmlformats-officedocument.presentationml.slideshow":["ppsx"],"application/vnd.openxmlformats-officedocument.presentationml.template":["potx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":["xlsx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.template":["xltx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":["docx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.template":["dotx"],"application/vnd.osgeo.mapguide.package":["mgp"],"application/vnd.osgi.dp":["dp"],"application/vnd.osgi.subsystem":["esa"],"application/vnd.palm":["pdb","pqa","oprc"],"application/vnd.pawaafile":["paw"],"application/vnd.pg.format":["str"],"application/vnd.pg.osasli":["ei6"],"application/vnd.picsel":["efif"],"application/vnd.pmi.widget":["wg"],"application/vnd.pocketlearn":["plf"],"application/vnd.powerbuilder6":["pbd"],"application/vnd.previewsystems.box":["box"],"application/vnd.proteus.magazine":["mgz"],"application/vnd.publishare-delta-tree":["qps"],"application/vnd.pvi.ptid1":["ptid"],"application/vnd.quark.quarkxpress":["qxd","qxt","qwd","qwt","qxl","qxb"],"application/vnd.rar":["rar"],"application/vnd.realvnc.bed":["bed"],"application/vnd.recordare.musicxml":["mxl"],"application/vnd.recordare.musicxml+xml":["musicxml"],"application/vnd.rig.cryptonote":["cryptonote"],"application/vnd.rim.cod":["cod"],"application/vnd.rn-realmedia":["rm"],"application/vnd.rn-realmedia-vbr":["rmvb"],"application/vnd.route66.link66+xml":["link66"],"application/vnd.sailingtracker.track":["st"],"application/vnd.seemail":["see"],"application/vnd.sema":["sema"],"application/vnd.semd":["semd"],"application/vnd.semf":["semf"],"application/vnd.shana.informed.formdata":["ifm"],"application/vnd.shana.informed.formtemplate":["itp"],"application/vnd.shana.informed.interchange":["iif"],"application/vnd.shana.informed.package":["ipk"],"application/vnd.simtech-mindmapper":["twd","twds"],"application/vnd.smaf":["mmf"],"application/vnd.smart.teacher":["teacher"],"application/vnd.software602.filler.form+xml":["fo"],"application/vnd.solent.sdkm+xml":["sdkm","sdkd"],"application/vnd.spotfire.dxp":["dxp"],"application/vnd.spotfire.sfs":["sfs"],"application/vnd.stardivision.calc":["sdc"],"application/vnd.stardivision.draw":["sda"],"application/vnd.stardivision.impress":["sdd"],"application/vnd.stardivision.math":["smf"],"application/vnd.stardivision.writer":["sdw","vor"],"application/vnd.stardivision.writer-global":["sgl"],"application/vnd.stepmania.package":["smzip"],"application/vnd.stepmania.stepchart":["sm"],"application/vnd.sun.wadl+xml":["wadl"],"application/vnd.sun.xml.calc":["sxc"],"application/vnd.sun.xml.calc.template":["stc"],"application/vnd.sun.xml.draw":["sxd"],"application/vnd.sun.xml.draw.template":["std"],"application/vnd.sun.xml.impress":["sxi"],"application/vnd.sun.xml.impress.template":["sti"],"application/vnd.sun.xml.math":["sxm"],"application/vnd.sun.xml.writer":["sxw"],"application/vnd.sun.xml.writer.global":["sxg"],"application/vnd.sun.xml.writer.template":["stw"],"application/vnd.sus-calendar":["sus","susp"],"application/vnd.svd":["svd"],"application/vnd.symbian.install":["sis","sisx"],"application/vnd.syncml+xml":["xsm"],"application/vnd.syncml.dm+wbxml":["bdm"],"application/vnd.syncml.dm+xml":["xdm"],"application/vnd.syncml.dmddf+xml":["ddf"],"application/vnd.tao.intent-module-archive":["tao"],"application/vnd.tcpdump.pcap":["pcap","cap","dmp"],"application/vnd.tmobile-livetv":["tmo"],"application/vnd.trid.tpt":["tpt"],"application/vnd.triscape.mxs":["mxs"],"application/vnd.trueapp":["tra"],"application/vnd.ufdl":["ufd","ufdl"],"application/vnd.uiq.theme":["utz"],"application/vnd.umajin":["umj"],"application/vnd.unity":["unityweb"],"application/vnd.uoml+xml":["uoml"],"application/vnd.vcx":["vcx"],"application/vnd.visio":["vsd","vst","vss","vsw"],"application/vnd.visionary":["vis"],"application/vnd.vsf":["vsf"],"application/vnd.wap.wbxml":["wbxml"],"application/vnd.wap.wmlc":["wmlc"],"application/vnd.wap.wmlscriptc":["wmlsc"],"application/vnd.webturbo":["wtb"],"application/vnd.wolfram.player":["nbp"],"application/vnd.wordperfect":["wpd"],"application/vnd.wqd":["wqd"],"application/vnd.wt.stf":["stf"],"application/vnd.xara":["xar"],"application/vnd.xfdl":["xfdl"],"application/vnd.yamaha.hv-dic":["hvd"],"application/vnd.yamaha.hv-script":["hvs"],"application/vnd.yamaha.hv-voice":["hvp"],"application/vnd.yamaha.openscoreformat":["osf"],"application/vnd.yamaha.openscoreformat.osfpvg+xml":["osfpvg"],"application/vnd.yamaha.smaf-audio":["saf"],"application/vnd.yamaha.smaf-phrase":["spf"],"application/vnd.yellowriver-custom-menu":["cmp"],"application/vnd.zul":["zir","zirz"],"application/vnd.zzazz.deck+xml":["zaz"],"application/x-7z-compressed":["7z"],"application/x-abiword":["abw"],"application/x-ace-compressed":["ace"],"application/x-apple-diskimage":["*dmg"],"application/x-arj":["arj"],"application/x-authorware-bin":["aab","x32","u32","vox"],"application/x-authorware-map":["aam"],"application/x-authorware-seg":["aas"],"application/x-bcpio":["bcpio"],"application/x-bdoc":["*bdoc"],"application/x-bittorrent":["torrent"],"application/x-blorb":["blb","blorb"],"application/x-bzip":["bz"],"application/x-bzip2":["bz2","boz"],"application/x-cbr":["cbr","cba","cbt","cbz","cb7"],"application/x-cdlink":["vcd"],"application/x-cfs-compressed":["cfs"],"application/x-chat":["chat"],"application/x-chess-pgn":["pgn"],"application/x-chrome-extension":["crx"],"application/x-cocoa":["cco"],"application/x-conference":["nsc"],"application/x-cpio":["cpio"],"application/x-csh":["csh"],"application/x-debian-package":["*deb","udeb"],"application/x-dgc-compressed":["dgc"],"application/x-director":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"],"application/x-doom":["wad"],"application/x-dtbncx+xml":["ncx"],"application/x-dtbook+xml":["dtb"],"application/x-dtbresource+xml":["res"],"application/x-dvi":["dvi"],"application/x-envoy":["evy"],"application/x-eva":["eva"],"application/x-font-bdf":["bdf"],"application/x-font-ghostscript":["gsf"],"application/x-font-linux-psf":["psf"],"application/x-font-pcf":["pcf"],"application/x-font-snf":["snf"],"application/x-font-type1":["pfa","pfb","pfm","afm"],"application/x-freearc":["arc"],"application/x-futuresplash":["spl"],"application/x-gca-compressed":["gca"],"application/x-glulx":["ulx"],"application/x-gnumeric":["gnumeric"],"application/x-gramps-xml":["gramps"],"application/x-gtar":["gtar"],"application/x-hdf":["hdf"],"application/x-httpd-php":["php"],"application/x-install-instructions":["install"],"application/x-iso9660-image":["*iso"],"application/x-iwork-keynote-sffkey":["*key"],"application/x-iwork-numbers-sffnumbers":["*numbers"],"application/x-iwork-pages-sffpages":["*pages"],"application/x-java-archive-diff":["jardiff"],"application/x-java-jnlp-file":["jnlp"],"application/x-keepass2":["kdbx"],"application/x-latex":["latex"],"application/x-lua-bytecode":["luac"],"application/x-lzh-compressed":["lzh","lha"],"application/x-makeself":["run"],"application/x-mie":["mie"],"application/x-mobipocket-ebook":["prc","mobi"],"application/x-ms-application":["application"],"application/x-ms-shortcut":["lnk"],"application/x-ms-wmd":["wmd"],"application/x-ms-wmz":["wmz"],"application/x-ms-xbap":["xbap"],"application/x-msaccess":["mdb"],"application/x-msbinder":["obd"],"application/x-mscardfile":["crd"],"application/x-msclip":["clp"],"application/x-msdos-program":["*exe"],"application/x-msdownload":["*exe","*dll","com","bat","*msi"],"application/x-msmediaview":["mvb","m13","m14"],"application/x-msmetafile":["*wmf","*wmz","*emf","emz"],"application/x-msmoney":["mny"],"application/x-mspublisher":["pub"],"application/x-msschedule":["scd"],"application/x-msterminal":["trm"],"application/x-mswrite":["wri"],"application/x-netcdf":["nc","cdf"],"application/x-ns-proxy-autoconfig":["pac"],"application/x-nzb":["nzb"],"application/x-perl":["pl","pm"],"application/x-pilot":["*prc","*pdb"],"application/x-pkcs12":["p12","pfx"],"application/x-pkcs7-certificates":["p7b","spc"],"application/x-pkcs7-certreqresp":["p7r"],"application/x-rar-compressed":["*rar"],"application/x-redhat-package-manager":["rpm"],"application/x-research-info-systems":["ris"],"application/x-sea":["sea"],"application/x-sh":["sh"],"application/x-shar":["shar"],"application/x-shockwave-flash":["swf"],"application/x-silverlight-app":["xap"],"application/x-sql":["sql"],"application/x-stuffit":["sit"],"application/x-stuffitx":["sitx"],"application/x-subrip":["srt"],"application/x-sv4cpio":["sv4cpio"],"application/x-sv4crc":["sv4crc"],"application/x-t3vm-image":["t3"],"application/x-tads":["gam"],"application/x-tar":["tar"],"application/x-tcl":["tcl","tk"],"application/x-tex":["tex"],"application/x-tex-tfm":["tfm"],"application/x-texinfo":["texinfo","texi"],"application/x-tgif":["*obj"],"application/x-ustar":["ustar"],"application/x-virtualbox-hdd":["hdd"],"application/x-virtualbox-ova":["ova"],"application/x-virtualbox-ovf":["ovf"],"application/x-virtualbox-vbox":["vbox"],"application/x-virtualbox-vbox-extpack":["vbox-extpack"],"application/x-virtualbox-vdi":["vdi"],"application/x-virtualbox-vhd":["vhd"],"application/x-virtualbox-vmdk":["vmdk"],"application/x-wais-source":["src"],"application/x-web-app-manifest+json":["webapp"],"application/x-x509-ca-cert":["der","crt","pem"],"application/x-xfig":["fig"],"application/x-xliff+xml":["*xlf"],"application/x-xpinstall":["xpi"],"application/x-xz":["xz"],"application/x-zmachine":["z1","z2","z3","z4","z5","z6","z7","z8"],"audio/vnd.dece.audio":["uva","uvva"],"audio/vnd.digital-winds":["eol"],"audio/vnd.dra":["dra"],"audio/vnd.dts":["dts"],"audio/vnd.dts.hd":["dtshd"],"audio/vnd.lucent.voice":["lvp"],"audio/vnd.ms-playready.media.pya":["pya"],"audio/vnd.nuera.ecelp4800":["ecelp4800"],"audio/vnd.nuera.ecelp7470":["ecelp7470"],"audio/vnd.nuera.ecelp9600":["ecelp9600"],"audio/vnd.rip":["rip"],"audio/x-aac":["aac"],"audio/x-aiff":["aif","aiff","aifc"],"audio/x-caf":["caf"],"audio/x-flac":["flac"],"audio/x-m4a":["*m4a"],"audio/x-matroska":["mka"],"audio/x-mpegurl":["m3u"],"audio/x-ms-wax":["wax"],"audio/x-ms-wma":["wma"],"audio/x-pn-realaudio":["ram","ra"],"audio/x-pn-realaudio-plugin":["rmp"],"audio/x-realaudio":["*ra"],"audio/x-wav":["*wav"],"chemical/x-cdx":["cdx"],"chemical/x-cif":["cif"],"chemical/x-cmdf":["cmdf"],"chemical/x-cml":["cml"],"chemical/x-csml":["csml"],"chemical/x-xyz":["xyz"],"image/prs.btif":["btif"],"image/prs.pti":["pti"],"image/vnd.adobe.photoshop":["psd"],"image/vnd.airzip.accelerator.azv":["azv"],"image/vnd.dece.graphic":["uvi","uvvi","uvg","uvvg"],"image/vnd.djvu":["djvu","djv"],"image/vnd.dvb.subtitle":["*sub"],"image/vnd.dwg":["dwg"],"image/vnd.dxf":["dxf"],"image/vnd.fastbidsheet":["fbs"],"image/vnd.fpx":["fpx"],"image/vnd.fst":["fst"],"image/vnd.fujixerox.edmics-mmr":["mmr"],"image/vnd.fujixerox.edmics-rlc":["rlc"],"image/vnd.microsoft.icon":["ico"],"image/vnd.ms-dds":["dds"],"image/vnd.ms-modi":["mdi"],"image/vnd.ms-photo":["wdp"],"image/vnd.net-fpx":["npx"],"image/vnd.pco.b16":["b16"],"image/vnd.tencent.tap":["tap"],"image/vnd.valve.source.texture":["vtf"],"image/vnd.wap.wbmp":["wbmp"],"image/vnd.xiff":["xif"],"image/vnd.zbrush.pcx":["pcx"],"image/x-3ds":["3ds"],"image/x-cmu-raster":["ras"],"image/x-cmx":["cmx"],"image/x-freehand":["fh","fhc","fh4","fh5","fh7"],"image/x-icon":["*ico"],"image/x-jng":["jng"],"image/x-mrsid-image":["sid"],"image/x-ms-bmp":["*bmp"],"image/x-pcx":["*pcx"],"image/x-pict":["pic","pct"],"image/x-portable-anymap":["pnm"],"image/x-portable-bitmap":["pbm"],"image/x-portable-graymap":["pgm"],"image/x-portable-pixmap":["ppm"],"image/x-rgb":["rgb"],"image/x-tga":["tga"],"image/x-xbitmap":["xbm"],"image/x-xpixmap":["xpm"],"image/x-xwindowdump":["xwd"],"message/vnd.wfa.wsc":["wsc"],"model/vnd.collada+xml":["dae"],"model/vnd.dwf":["dwf"],"model/vnd.gdl":["gdl"],"model/vnd.gtw":["gtw"],"model/vnd.mts":["mts"],"model/vnd.opengex":["ogex"],"model/vnd.parasolid.transmit.binary":["x_b"],"model/vnd.parasolid.transmit.text":["x_t"],"model/vnd.sap.vds":["vds"],"model/vnd.usdz+zip":["usdz"],"model/vnd.valve.source.compiled-map":["bsp"],"model/vnd.vtu":["vtu"],"text/prs.lines.tag":["dsc"],"text/vnd.curl":["curl"],"text/vnd.curl.dcurl":["dcurl"],"text/vnd.curl.mcurl":["mcurl"],"text/vnd.curl.scurl":["scurl"],"text/vnd.dvb.subtitle":["sub"],"text/vnd.fly":["fly"],"text/vnd.fmi.flexstor":["flx"],"text/vnd.graphviz":["gv"],"text/vnd.in3d.3dml":["3dml"],"text/vnd.in3d.spot":["spot"],"text/vnd.sun.j2me.app-descriptor":["jad"],"text/vnd.wap.wml":["wml"],"text/vnd.wap.wmlscript":["wmls"],"text/x-asm":["s","asm"],"text/x-c":["c","cc","cxx","cpp","h","hh","dic"],"text/x-component":["htc"],"text/x-fortran":["f","for","f77","f90"],"text/x-handlebars-template":["hbs"],"text/x-java-source":["java"],"text/x-lua":["lua"],"text/x-markdown":["mkd"],"text/x-nfo":["nfo"],"text/x-opml":["opml"],"text/x-org":["*org"],"text/x-pascal":["p","pas"],"text/x-processing":["pde"],"text/x-sass":["sass"],"text/x-scss":["scss"],"text/x-setext":["etx"],"text/x-sfv":["sfv"],"text/x-suse-ymp":["ymp"],"text/x-uuencode":["uu"],"text/x-vcalendar":["vcs"],"text/x-vcard":["vcf"],"video/vnd.dece.hd":["uvh","uvvh"],"video/vnd.dece.mobile":["uvm","uvvm"],"video/vnd.dece.pd":["uvp","uvvp"],"video/vnd.dece.sd":["uvs","uvvs"],"video/vnd.dece.video":["uvv","uvvv"],"video/vnd.dvb.file":["dvb"],"video/vnd.fvt":["fvt"],"video/vnd.mpegurl":["mxu","m4u"],"video/vnd.ms-playready.media.pyv":["pyv"],"video/vnd.uvvu.mp4":["uvu","uvvu"],"video/vnd.vivo":["viv"],"video/x-f4v":["f4v"],"video/x-fli":["fli"],"video/x-flv":["flv"],"video/x-m4v":["m4v"],"video/x-matroska":["mkv","mk3d","mks"],"video/x-mng":["mng"],"video/x-ms-asf":["asf","asx"],"video/x-ms-vob":["vob"],"video/x-ms-wm":["wm"],"video/x-ms-wmv":["wmv"],"video/x-ms-wmx":["wmx"],"video/x-ms-wvx":["wvx"],"video/x-msvideo":["avi"],"video/x-sgi-movie":["movie"],"video/x-smv":["smv"],"x-conference/x-cooltalk":["ice"]};

let Mime = Mime_1;
var mime = new Mime(standard, other);

const mime$1 = /*@__PURE__*/getDefaultExportFromCjs(mime);

async function callMiddleware(logger, onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async () => {
    nextCalled = true;
    responseFunctionPromise = responseFunction();
    return responseFunctionPromise;
  };
  let middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (isEndpointOutput(value)) {
      logger.warn(
        "middleware",
        `Using simple endpoints can cause unexpected issues in the chain of middleware functions.
It's strongly suggested to use full ${bold("Response")} objects.`
      );
    }
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return ensureCookiesAttached(apiContext, value);
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return ensureCookiesAttached(apiContext, value);
    }
  });
}
function ensureCookiesAttached(apiContext, response) {
  if (apiContext.cookies !== void 0 && !responseHasCookies(response)) {
    attachCookiesToResponse(response, apiContext.cookies);
  }
  return response;
}
function isEndpointOutput(endpointResult) {
  return !(endpointResult instanceof Response) && typeof endpointResult === "object" && typeof endpointResult.body === "string";
}

function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}

function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}
function redirectRouteGenerate(redirectRoute, data) {
  const routeData = redirectRoute.redirectRoute;
  const route = redirectRoute.redirect;
  if (typeof routeData !== "undefined") {
    return routeData?.generate(data) || routeData?.pathname || "/";
  } else if (typeof route === "string") {
    return route;
  } else if (typeof route === "undefined") {
    return "/";
  }
  return route.destination;
}
function redirectRouteStatus(redirectRoute, method = "GET") {
  const routeData = redirectRoute.redirectRoute;
  if (typeof routeData?.redirect === "object") {
    return routeData.redirect.status;
  } else if (method !== "GET") {
    return 308;
  }
  return 301;
}

const VALID_PARAM_TYPES = ["string", "number", "undefined"];
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError({
      ...GetStaticPathsInvalidRouteParam,
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    });
  }
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && !mod.getStaticPaths) {
    throw new AstroError({
      ...GetStaticPathsRequired,
      location: { file: route.component }
    });
  }
}
function validateGetStaticPathsResult(result, logger, route) {
  if (!Array.isArray(result)) {
    throw new AstroError({
      ...InvalidGetStaticPathsReturn,
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    });
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError({
        ...InvalidGetStaticPathsEntry,
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      });
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError({
        ...GetStaticPathsExpectedParams,
        location: {
          file: route.component
        }
      });
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string" || typeof val === "number")) {
        logger.warn(
          "getStaticPaths",
          `invalid path param: ${key}. A string, number or undefined value was expected, but got \`${JSON.stringify(
            val
          )}\`.`
        );
      }
      if (typeof val === "string" && val === "") {
        logger.warn(
          "getStaticPaths",
          `invalid path param: ${key}. \`undefined\` expected for an optional param, but got empty string.`
        );
      }
    }
  });
}

function getParams(array) {
  const fn = (match) => {
    const params = {};
    array.forEach((key, i) => {
      if (key.startsWith("...")) {
        params[key.slice(3)] = match[i + 1] ? decodeURIComponent(match[i + 1]) : void 0;
      } else {
        params[key] = decodeURIComponent(match[i + 1]);
      }
    });
    return params;
  };
  return fn;
}
function stringifyParams(params, route) {
  const validatedParams = Object.entries(params).reduce((acc, next) => {
    validateGetStaticPathsParameter(next, route.component);
    const [key, value] = next;
    if (value !== void 0) {
      acc[key] = typeof value === "string" ? trimSlashes(value) : value.toString();
    }
    return acc;
  }, {});
  return JSON.stringify(route.generate(validatedParams));
}

function generatePaginateFunction(routeMatch) {
  return function paginateUtility(data, args = {}) {
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError({
        ...PageNumberParamNotFound,
        message: PageNumberParamNotFound.message(paramName)
      });
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = correctIndexRoute(routeMatch.generate({ ...params }));
      const next = pageNum === lastPage ? void 0 : correctIndexRoute(routeMatch.generate({ ...params, page: String(pageNum + 1) }));
      const prev = pageNum === 1 ? void 0 : correctIndexRoute(
        routeMatch.generate({
          ...params,
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        })
      );
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start, end),
            start,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev }
          }
        }
      };
    });
    return result;
  };
}
function correctIndexRoute(route) {
  if (route === "") {
    return "/";
  }
  return route;
}

async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  logger,
  ssr
}) {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  }
  if (cached?.staticPaths) {
    return cached.staticPaths;
  }
  validateDynamicRouteModule(mod, { ssr, route });
  if (ssr && !route.prerender) {
    const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, { ...cached, staticPaths: entry });
    return entry;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route),
    rss() {
      throw new AstroError(GetStaticPathsRemovedRSSHelper);
    }
  });
  validateGetStaticPathsResult(staticPaths, logger, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, { ...cached, staticPaths: keyedStaticPaths });
  return keyedStaticPaths;
}
class RouteCache {
  logger;
  cache = {};
  mode;
  constructor(logger, mode = "production") {
    this.logger = logger;
    this.mode = mode;
  }
  /** Clear the cache. */
  clearAll() {
    this.cache = {};
  }
  set(route, entry) {
    if (this.mode === "production" && this.cache[route.component]?.staticPaths) {
      this.logger.warn(
        "routeCache",
        `Internal Warning: route cache overwritten. (${route.component})`
      );
    }
    this.cache[route.component] = entry;
  }
  get(route) {
    return this.cache[route.component];
  }
}
function findPathItemByKey(staticPaths, params, route, logger) {
  const paramsKey = stringifyParams(params, route);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("findPathItemByKey", `Unexpected cache miss looking for ${paramsKey}`);
}

async function getParamsAndProps(opts) {
  const { logger, mod, route, routeCache, pathname, ssr } = opts;
  if (!route || route.pathname) {
    return [{}, {}];
  }
  const params = getRouteParams(route, pathname) ?? {};
  if (routeIsRedirect(route) || routeIsFallback(route)) {
    return [params, {}];
  }
  if (mod) {
    validatePrerenderEndpointCollision(route, mod, params);
  }
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    logger,
    ssr
  });
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger);
  if (!matchedStaticPath && (ssr ? route.prerender : true)) {
    throw new AstroError({
      ...NoMatchingStaticPathFound,
      message: NoMatchingStaticPathFound.message(pathname),
      hint: NoMatchingStaticPathFound.hint([route.component])
    });
  }
  const props = matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
  return [params, props];
}
function getRouteParams(route, pathname) {
  if (route.params.length) {
    const paramsMatch = route.pattern.exec(decodeURIComponent(pathname));
    if (paramsMatch) {
      return getParams(route.params)(paramsMatch);
    }
  }
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError({
        ...PrerenderDynamicEndpointPathCollide,
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      });
    }
  }
}

const clientLocalsSymbol$1 = Symbol.for("astro.locals");
async function createRenderContext(options) {
  const request = options.request;
  const pathname = options.pathname ?? new URL(request.url).pathname;
  const [params, props] = await getParamsAndProps({
    mod: options.mod,
    route: options.route,
    routeCache: options.env.routeCache,
    pathname,
    logger: options.env.logger,
    ssr: options.env.ssr
  });
  const context = {
    ...options,
    pathname,
    params,
    props,
    locales: options.locales
  };
  Object.defineProperty(context, "locals", {
    enumerable: true,
    get() {
      return Reflect.get(request, clientLocalsSymbol$1);
    },
    set(val) {
      if (typeof val !== "object") {
        throw new AstroError(LocalsNotAnObject);
      } else {
        Reflect.set(request, clientLocalsSymbol$1, val);
      }
    }
  });
  return context;
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = locales.map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      if (a.qualityValue > b.qualityValue) {
        return -1;
      } else if (a.qualityValue < b.qualityValue) {
        return 1;
      }
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult) {
      if (firstResult.locale !== "*") {
        result = locales.find(
          (locale) => normalizeTheLocale(locale) === normalizeTheLocale(firstResult.locale)
        );
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return locales;
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        const found = locales.find(
          (l) => normalizeTheLocale(l) === normalizeTheLocale(browserLocale.locale)
        );
        if (found) {
          result.push(found);
        }
      }
    }
  }
  return result;
}

const encoder = new TextEncoder();
const clientAddressSymbol = Symbol.for("astro.clientAddress");
const clientLocalsSymbol = Symbol.for("astro.locals");
function createAPIContext({
  request,
  params,
  site,
  props,
  adapterName,
  locales
}) {
  let preferredLocale = void 0;
  let preferredLocaleList = void 0;
  const context = {
    cookies: new AstroCookies(request),
    request,
    params,
    site: site ? new URL(site) : void 0,
    generator: `Astro v${ASTRO_VERSION}`,
    props,
    redirect(path, status) {
      return new Response(null, {
        status: status || 302,
        headers: {
          Location: path
        }
      });
    },
    ResponseWithEncoding,
    get preferredLocale() {
      if (preferredLocale) {
        return preferredLocale;
      }
      if (locales) {
        preferredLocale = computePreferredLocale(request, locales);
        return preferredLocale;
      }
      return void 0;
    },
    get preferredLocaleList() {
      if (preferredLocaleList) {
        return preferredLocaleList;
      }
      if (locales) {
        preferredLocaleList = computePreferredLocaleList(request, locales);
        return preferredLocaleList;
      }
      return void 0;
    },
    url: new URL(request.url),
    get clientAddress() {
      if (clientAddressSymbol in request) {
        return Reflect.get(request, clientAddressSymbol);
      }
      if (adapterName) {
        throw new AstroError({
          ...ClientAddressNotAvailable,
          message: ClientAddressNotAvailable.message(adapterName)
        });
      } else {
        throw new AstroError(StaticClientAddressNotAvailable);
      }
    },
    get locals() {
      let locals = Reflect.get(request, clientLocalsSymbol);
      if (locals === void 0) {
        locals = {};
        Reflect.set(request, clientLocalsSymbol, locals);
      }
      if (typeof locals !== "object") {
        throw new AstroError(LocalsNotAnObject);
      }
      return locals;
    },
    // We define a custom property, so we can check the value passed to locals
    set locals(val) {
      if (typeof val !== "object") {
        throw new AstroError(LocalsNotAnObject);
      } else {
        Reflect.set(request, clientLocalsSymbol, val);
      }
    }
  };
  return context;
}
class ResponseWithEncoding extends Response {
  constructor(body, init, encoding) {
    if (typeof body === "string") {
      if (typeof Buffer !== "undefined" && Buffer.from) {
        body = Buffer.from(body, encoding);
      } else if (encoding == null || encoding === "utf8" || encoding === "utf-8") {
        body = encoder.encode(body);
      }
    }
    super(body, init);
    if (encoding) {
      this.headers.set("X-Astro-Encoding", encoding);
    }
  }
}
async function callEndpoint(mod, env, ctx, onRequest, locales) {
  const context = createAPIContext({
    request: ctx.request,
    params: ctx.params,
    props: ctx.props,
    site: env.site,
    adapterName: env.adapterName,
    locales
  });
  let response;
  if (onRequest) {
    response = await callMiddleware(
      env.logger,
      onRequest,
      context,
      async () => {
        return await renderEndpoint(mod, context, env.ssr, env.logger);
      }
    );
  } else {
    response = await renderEndpoint(mod, context, env.ssr, env.logger);
  }
  const isEndpointSSR = env.ssr && !ctx.route?.prerender;
  if (response instanceof Response) {
    if (isEndpointSSR && response.headers.get("X-Astro-Encoding")) {
      env.logger.warn(
        "ssr",
        "`ResponseWithEncoding` is ignored in SSR. Please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information."
      );
    }
    attachCookiesToResponse(response, context.cookies);
    return response;
  }
  env.logger.warn(
    "astro",
    `${ctx.route.component} returns a simple object which is deprecated. Please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information.`
  );
  if (isEndpointSSR) {
    if (response.hasOwnProperty("headers")) {
      env.logger.warn(
        "ssr",
        "Setting headers is not supported when returning an object. Please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information."
      );
    }
    if (response.encoding) {
      env.logger.warn(
        "ssr",
        "`encoding` is ignored in SSR. To return a charset other than UTF-8, please return an instance of Response. See https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes for more information."
      );
    }
  }
  let body;
  const headers = new Headers();
  const pathname = ctx.route ? (
    // Try the static route `pathname`
    ctx.route.pathname ?? // Dynamic routes don't include `pathname`, so synthesize a path for these (e.g. 'src/pages/[slug].svg')
    ctx.route.segments.map((s) => s.map((p) => p.content).join("")).join("/")
  ) : (
    // Fallback to pathname of the request
    ctx.pathname
  );
  const mimeType = mime$1.getType(pathname) || "text/plain";
  headers.set("Content-Type", `${mimeType};charset=utf-8`);
  if (response.encoding) {
    headers.set("X-Astro-Encoding", response.encoding);
  }
  if (response.body instanceof Uint8Array) {
    body = response.body;
    headers.set("Content-Length", body.byteLength.toString());
  } else if (typeof Buffer !== "undefined" && Buffer.from) {
    body = Buffer.from(response.body, response.encoding);
    headers.set("Content-Length", body.byteLength.toString());
  } else if (response.encoding == null || response.encoding === "utf8" || response.encoding === "utf-8") {
    body = encoder.encode(response.body);
    headers.set("Content-Length", body.byteLength.toString());
  } else {
    body = response.body;
  }
  response = new Response(body, {
    status: 200,
    headers
  });
  attachCookiesToResponse(response, context.cookies);
  return response;
}

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"_meta":{"trailingSlash":"ignore"}}},{"file":"leaderboard/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/leaderboard","type":"page","pattern":"^\\/leaderboard\\/?$","segments":[[{"content":"leaderboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/leaderboard.astro","pathname":"/leaderboard","prerender":true,"_meta":{"trailingSlash":"ignore"}}},{"file":"standings/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/standings","type":"page","pattern":"^\\/standings\\/?$","segments":[[{"content":"standings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/standings.astro","pathname":"/standings","prerender":true,"_meta":{"trailingSlash":"ignore"}}},{"file":"fixtures/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/fixtures","type":"page","pattern":"^\\/fixtures\\/?$","segments":[[{"content":"fixtures","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/fixtures.astro","pathname":"/fixtures","prerender":true,"_meta":{"trailingSlash":"ignore"}}},{"file":"gallery/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/gallery","type":"page","pattern":"^\\/gallery\\/?$","segments":[[{"content":"gallery","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/gallery.astro","pathname":"/gallery","prerender":true,"_meta":{"trailingSlash":"ignore"}}},{"file":"results/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/results","type":"page","pattern":"^\\/results\\/?$","segments":[[{"content":"results","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/results.astro","pathname":"/results","prerender":true,"_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"_meta":{"trailingSlash":"ignore"}}},{"file":"news/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/news","type":"page","pattern":"^\\/news\\/?$","segments":[[{"content":"news","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/news.astro","pathname":"/news","prerender":true,"_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@3.5.5/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"_meta":{"trailingSlash":"ignore"}}}],"site":"https://upl-xi.vercel.app","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/about.astro",{"propagation":"in-tree","containsHead":true}],["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/blog/[slug].astro",{"propagation":"in-tree","containsHead":true}],["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/fixtures.astro",{"propagation":"none","containsHead":true}],["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/gallery.astro",{"propagation":"none","containsHead":true}],["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/leaderboard.astro",{"propagation":"none","containsHead":true}],["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/news.astro",{"propagation":"in-tree","containsHead":true}],["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/results.astro",{"propagation":"none","containsHead":true}],["/Users/kevin/Desktop/workspace/projects/websites/upl/src/pages/standings.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/about@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/news@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,s)=>{let n=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),n();break}});for(let e of s.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","\u0000@astrojs-manifest":"manifest_22d6ecb4.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/node_modules/.pnpm/@astrojs+react@3.3.0_@types+react-dom@18.2.25_@types+react@18.2.79_react-dom@18.2.0_react@18.2.0_vite@4.5.0/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_1c888aad.mjs","\u0000@astro-page:node_modules/.pnpm/astro@3.5.5/node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_dabd4728.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_729935cd.mjs","\u0000@astro-page:src/pages/leaderboard@_@astro":"chunks/leaderboard_51673175.mjs","\u0000@astro-page:src/pages/standings@_@astro":"chunks/standings_91d066b5.mjs","\u0000@astro-page:src/pages/fixtures@_@astro":"chunks/fixtures_1fba9da4.mjs","\u0000@astro-page:src/pages/gallery@_@astro":"chunks/gallery_5af2f7fa.mjs","\u0000@astro-page:src/pages/results@_@astro":"chunks/results_7109df0d.mjs","\u0000@astro-page:src/pages/about@_@astro":"chunks/about_ddcb3561.mjs","\u0000@astro-page:src/pages/blog/[slug]@_@astro":"chunks/_slug__ac223107.mjs","\u0000@astro-page:src/pages/news@_@astro":"chunks/news_106a77e2.mjs","\u0000@astro-page:src/pages/404@_@astro":"chunks/404_b11a92dc.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/complete-guide-fullstack-development.md?astroContentCollectionEntry=true":"chunks/complete-guide-fullstack-development_f8c03ed7.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/essential-data-structures-algorithms.md?astroContentCollectionEntry=true":"chunks/essential-data-structures-algorithms_a9506bdc.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/how-to-become-frontend-master.md?astroContentCollectionEntry=true":"chunks/how-to-become-frontend-master_8b37bcac.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/kitchensink.mdx?astroContentCollectionEntry=true":"chunks/kitchensink_420b0827.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/team/janette-lynch.md?astroContentCollectionEntry=true":"chunks/janette-lynch_6dcc6c03.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/team/marcell-ziemann.md?astroContentCollectionEntry=true":"chunks/marcell-ziemann_343d5fde.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/team/robert-palmer.md?astroContentCollectionEntry=true":"chunks/robert-palmer_2ba7f41f.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/complete-guide-fullstack-development.md?astroPropagatedAssets":"chunks/complete-guide-fullstack-development_b781639a.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/essential-data-structures-algorithms.md?astroPropagatedAssets":"chunks/essential-data-structures-algorithms_cadd2c94.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/how-to-become-frontend-master.md?astroPropagatedAssets":"chunks/how-to-become-frontend-master_2b4660d2.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/kitchensink.mdx?astroPropagatedAssets":"chunks/kitchensink_15baec27.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/team/janette-lynch.md?astroPropagatedAssets":"chunks/janette-lynch_e9f18b17.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/team/marcell-ziemann.md?astroPropagatedAssets":"chunks/marcell-ziemann_1ba49ccc.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/team/robert-palmer.md?astroPropagatedAssets":"chunks/robert-palmer_0545bcc0.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/complete-guide-fullstack-development.md":"chunks/complete-guide-fullstack-development_27a289f5.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/essential-data-structures-algorithms.md":"chunks/essential-data-structures-algorithms_4de5b3e2.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/how-to-become-frontend-master.md":"chunks/how-to-become-frontend-master_d46c2edd.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/blog/kitchensink.mdx":"chunks/kitchensink_6dfddd59.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/team/janette-lynch.md":"chunks/janette-lynch_fdc0d9d7.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/team/marcell-ziemann.md":"chunks/marcell-ziemann_76fa8964.mjs","/Users/kevin/Desktop/workspace/projects/websites/upl/src/content/team/robert-palmer.md":"chunks/robert-palmer_934bbd03.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.09e636bb.js","@astrojs/react/client.js":"_astro/client.2ad5c339.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/hero.6fdd0dc6.png","/_astro/hero-source.05effa0e.svg","/_astro/raleway-cyrillic-ext-wght-normal.2ab70013.woff2","/_astro/raleway-latin-ext-wght-normal.4db78ee9.woff2","/_astro/raleway-cyrillic-wght-normal.89f273f4.woff2","/_astro/raleway-vietnamese-wght-normal.3eb84c62.woff2","/_astro/raleway-latin-wght-normal.8cbc049d.woff2","/_astro/k2d-vietnamese-400-normal.659149cd.woff2","/_astro/k2d-latin-ext-400-normal.a9a3f007.woff2","/_astro/k2d-latin-400-normal.c6dbe550.woff2","/_astro/k2d-latin-600-normal.abb28c38.woff2","/_astro/k2d-vietnamese-600-normal.7c4f63bf.woff2","/_astro/k2d-thai-400-normal.21b97b8d.woff2","/_astro/k2d-latin-ext-600-normal.79acb640.woff2","/_astro/k2d-thai-600-normal.765a06aa.woff2","/_astro/venue.a765ccea.jpg","/_astro/kunal.8b6b7475.png","/_astro/k2d-vietnamese-400-normal.9800f07d.woff","/_astro/k2d-latin-ext-400-normal.5d69647f.woff","/_astro/k2d-latin-400-normal.10694c7a.woff","/_astro/k2d-latin-600-normal.dbc09add.woff","/_astro/k2d-vietnamese-600-normal.28cb40ad.woff","/_astro/ekta.cf9c06b5.png","/_astro/grunge.601a8f77.png","/_astro/banner.45adfc6e.jpeg","/_astro/k2d-thai-400-normal.251fa958.woff","/_astro/akash.6fb8a842.png","/_astro/k2d-thai-600-normal.2022c0d7.woff","/_astro/k2d-latin-ext-600-normal.7b9b3364.woff","/_astro/mansi.276dbcb9.png","/_astro/poonam.d1197d69.png","/_astro/deepak.56576706.png","/_astro/swapnil.84faf77d.png","/_astro/aditya.05c2609c.png","/_astro/aboutTwo.dcf4d105.jpeg","/_astro/ranjan.ffb84ea0.png","/_astro/aboutOne.34a6f071.jpeg","/_astro/about.440d18b9.css","/android-chrome-192x192.png","/android-chrome-512x512.png","/apple-touch-icon.png","/browserconfig.xml","/favicon-16x16.png","/favicon-32x32.png","/favicon.ico","/favicon.svg","/mstile-150x150.png","/opengraph.jpg","/robots.txt","/safari-pinned-tab.svg","/site.webmanifest","/venue.png","/_astro/client.2ad5c339.js","/_astro/hoisted.09e636bb.js","/index.html","/leaderboard/index.html","/standings/index.html","/fixtures/index.html","/gallery/index.html","/results/index.html","/about/index.html","/news/index.html","/404.html"]});

export { AstroCookies as A, Logger as L, RouteCache as R, dateTimeFormat as a, bold as b, cyan as c, dim as d, reset as e, computePreferredLocale as f, computePreferredLocaleList as g, routeIsRedirect as h, redirectRouteStatus as i, redirectRouteGenerate as j, routeIsFallback as k, levels as l, attachCookiesToResponse as m, manifest, createAPIContext as n, callEndpoint as o, callMiddleware as p, AstroIntegrationLogger as q, red as r, getSetCookiesFromResponse as s, createRenderContext as t, yellow as y };
