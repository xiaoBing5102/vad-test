var Rt = Object.create;
var mt = Object.defineProperty;
var Dt = Object.getOwnPropertyDescriptor;
var xt = Object.getOwnPropertyNames;
var Mt = Object.getPrototypeOf,
  Bt = Object.prototype.hasOwnProperty;
var Ct = (o, t) => () => (t || o((t = { exports: {} }).exports, t), t.exports);
var Vt = (o, t, s, r) => {
  if ((t && typeof t == 'object') || typeof t == 'function')
    for (let e of xt(t))
      !Bt.call(o, e) &&
        e !== s &&
        mt(o, e, {
          get: () => t[e],
          enumerable: !(r = Dt(t, e)) || r.enumerable,
        });
  return o;
};
var It = (o, t, s) => (
  (s = o != null ? Rt(Mt(o)) : {}),
  Vt(
    t || !o || !o.__esModule
      ? mt(s, 'default', { value: o, enumerable: !0 })
      : s,
    o
  )
);
var pt = Ct((Wt, ut) => {
  'use strict';
  function F(o) {
    if (((this.size = o | 0), this.size <= 1 || this.size & (this.size - 1)))
      throw new Error('FFT size must be a power of two and bigger than 1');
    this._csize = o << 1;
    for (var t = new Array(this.size * 2), s = 0; s < t.length; s += 2) {
      let m = (Math.PI * s) / this.size;
      (t[s] = Math.cos(m)), (t[s + 1] = -Math.sin(m));
    }
    this.table = t;
    for (var r = 0, e = 1; this.size > e; e <<= 1) r++;
    (this._width = r % 2 === 0 ? r - 1 : r),
      (this._bitrev = new Array(1 << this._width));
    for (var i = 0; i < this._bitrev.length; i++) {
      this._bitrev[i] = 0;
      for (var n = 0; n < this._width; n += 2) {
        var a = this._width - n - 2;
        this._bitrev[i] |= ((i >>> n) & 3) << a;
      }
    }
    (this._out = null), (this._data = null), (this._inv = 0);
  }
  ut.exports = F;
  F.prototype.fromComplexArray = function (t, s) {
    for (var r = s || new Array(t.length >>> 1), e = 0; e < t.length; e += 2)
      r[e >>> 1] = t[e];
    return r;
  };
  F.prototype.createComplexArray = function () {
    let t = new Array(this._csize);
    for (var s = 0; s < t.length; s++) t[s] = 0;
    return t;
  };
  F.prototype.toComplexArray = function (t, s) {
    for (var r = s || this.createComplexArray(), e = 0; e < r.length; e += 2)
      (r[e] = t[e >>> 1]), (r[e + 1] = 0);
    return r;
  };
  F.prototype.completeSpectrum = function (t) {
    for (var s = this._csize, r = s >>> 1, e = 2; e < r; e += 2)
      (t[s - e] = t[e]), (t[s - e + 1] = -t[e + 1]);
  };
  F.prototype.transform = function (t, s) {
    if (t === s) throw new Error('Input and output buffers must be different');
    (this._out = t),
      (this._data = s),
      (this._inv = 0),
      this._transform4(),
      (this._out = null),
      (this._data = null);
  };
  F.prototype.realTransform = function (t, s) {
    if (t === s) throw new Error('Input and output buffers must be different');
    (this._out = t),
      (this._data = s),
      (this._inv = 0),
      this._realTransform4(),
      (this._out = null),
      (this._data = null);
  };
  F.prototype.inverseTransform = function (t, s) {
    if (t === s) throw new Error('Input and output buffers must be different');
    (this._out = t), (this._data = s), (this._inv = 1), this._transform4();
    for (var r = 0; r < t.length; r++) t[r] /= this.size;
    (this._out = null), (this._data = null);
  };
  F.prototype._transform4 = function () {
    var t = this._out,
      s = this._csize,
      r = this._width,
      e = 1 << r,
      i = (s / e) << 1,
      n,
      a,
      m = this._bitrev;
    if (i === 4)
      for (n = 0, a = 0; n < s; n += i, a++) {
        let c = m[a];
        this._singleTransform2(n, c, e);
      }
    else
      for (n = 0, a = 0; n < s; n += i, a++) {
        let c = m[a];
        this._singleTransform4(n, c, e);
      }
    var h = this._inv ? -1 : 1,
      l = this.table;
    for (e >>= 2; e >= 2; e >>= 2) {
      i = (s / e) << 1;
      var u = i >>> 2;
      for (n = 0; n < s; n += i)
        for (var _ = n + u, v = n, f = 0; v < _; v += 2, f += e) {
          let c = v,
            p = c + u,
            d = p + u,
            y = d + u,
            g = t[c],
            T = t[c + 1],
            b = t[p],
            A = t[p + 1],
            w = t[d],
            P = t[d + 1],
            z = t[y],
            R = t[y + 1],
            D = g,
            x = T,
            M = l[f],
            B = h * l[f + 1],
            C = b * M - A * B,
            V = b * B + A * M,
            W = l[2 * f],
            N = h * l[2 * f + 1],
            Q = w * W - P * N,
            H = w * N + P * W,
            J = l[3 * f],
            K = h * l[3 * f + 1],
            U = z * J - R * K,
            X = z * K + R * J,
            Y = D + Q,
            I = x + H,
            S = D - Q,
            Z = x - H,
            $ = C + U,
            E = V + X,
            G = h * (C - U),
            q = h * (V - X),
            j = Y + $,
            tt = I + E,
            st = Y - $,
            et = I - E,
            rt = S + q,
            it = Z - G,
            nt = S - q,
            ot = Z + G;
          (t[c] = j),
            (t[c + 1] = tt),
            (t[p] = rt),
            (t[p + 1] = it),
            (t[d] = st),
            (t[d + 1] = et),
            (t[y] = nt),
            (t[y + 1] = ot);
        }
    }
  };
  F.prototype._singleTransform2 = function (t, s, r) {
    let e = this._out,
      i = this._data,
      n = i[s],
      a = i[s + 1],
      m = i[s + r],
      h = i[s + r + 1],
      l = n + m,
      u = a + h,
      _ = n - m,
      v = a - h;
    (e[t] = l), (e[t + 1] = u), (e[t + 2] = _), (e[t + 3] = v);
  };
  F.prototype._singleTransform4 = function (t, s, r) {
    let e = this._out,
      i = this._data,
      n = this._inv ? -1 : 1,
      a = r * 2,
      m = r * 3,
      h = i[s],
      l = i[s + 1],
      u = i[s + r],
      _ = i[s + r + 1],
      v = i[s + a],
      f = i[s + a + 1],
      c = i[s + m],
      p = i[s + m + 1],
      d = h + v,
      y = l + f,
      g = h - v,
      T = l - f,
      b = u + c,
      A = _ + p,
      w = n * (u - c),
      P = n * (_ - p),
      z = d + b,
      R = y + A,
      D = g + P,
      x = T - w,
      M = d - b,
      B = y - A,
      C = g - P,
      V = T + w;
    (e[t] = z),
      (e[t + 1] = R),
      (e[t + 2] = D),
      (e[t + 3] = x),
      (e[t + 4] = M),
      (e[t + 5] = B),
      (e[t + 6] = C),
      (e[t + 7] = V);
  };
  F.prototype._realTransform4 = function () {
    var t = this._out,
      s = this._csize,
      r = this._width,
      e = 1 << r,
      i = (s / e) << 1,
      n,
      a,
      m = this._bitrev;
    if (i === 4)
      for (n = 0, a = 0; n < s; n += i, a++) {
        let at = m[a];
        this._singleRealTransform2(n, at >>> 1, e >>> 1);
      }
    else
      for (n = 0, a = 0; n < s; n += i, a++) {
        let at = m[a];
        this._singleRealTransform4(n, at >>> 1, e >>> 1);
      }
    var h = this._inv ? -1 : 1,
      l = this.table;
    for (e >>= 2; e >= 2; e >>= 2) {
      i = (s / e) << 1;
      var u = i >>> 1,
        _ = u >>> 1,
        v = _ >>> 1;
      for (n = 0; n < s; n += i)
        for (var f = 0, c = 0; f <= v; f += 2, c += e) {
          var p = n + f,
            d = p + _,
            y = d + _,
            g = y + _,
            T = t[p],
            b = t[p + 1],
            A = t[d],
            w = t[d + 1],
            P = t[y],
            z = t[y + 1],
            R = t[g],
            D = t[g + 1],
            x = T,
            M = b,
            B = l[c],
            C = h * l[c + 1],
            V = A * B - w * C,
            W = A * C + w * B,
            N = l[2 * c],
            Q = h * l[2 * c + 1],
            H = P * N - z * Q,
            J = P * Q + z * N,
            K = l[3 * c],
            U = h * l[3 * c + 1],
            X = R * K - D * U,
            Y = R * U + D * K,
            I = x + H,
            S = M + J,
            Z = x - H,
            $ = M - J,
            E = V + X,
            G = W + Y,
            q = h * (V - X),
            j = h * (W - Y),
            tt = I + E,
            st = S + G,
            et = Z + j,
            rt = $ - q;
          if (
            ((t[p] = tt),
            (t[p + 1] = st),
            (t[d] = et),
            (t[d + 1] = rt),
            f === 0)
          ) {
            var it = I - E,
              nt = S - G;
            (t[y] = it), (t[y + 1] = nt);
            continue;
          }
          if (f !== v) {
            var ot = Z,
              vt = -$,
              dt = I,
              yt = -S,
              Ft = -h * j,
              At = -h * q,
              gt = -h * G,
              bt = -h * E,
              Tt = ot + Ft,
              wt = vt + At,
              Pt = dt + bt,
              zt = yt - gt,
              lt = n + _ - f,
              ft = n + u - f;
            (t[lt] = Tt), (t[lt + 1] = wt), (t[ft] = Pt), (t[ft + 1] = zt);
          }
        }
    }
  };
  F.prototype._singleRealTransform2 = function (t, s, r) {
    let e = this._out,
      i = this._data,
      n = i[s],
      a = i[s + r],
      m = n + a,
      h = n - a;
    (e[t] = m), (e[t + 1] = 0), (e[t + 2] = h), (e[t + 3] = 0);
  };
  F.prototype._singleRealTransform4 = function (t, s, r) {
    let e = this._out,
      i = this._data,
      n = this._inv ? -1 : 1,
      a = r * 2,
      m = r * 3,
      h = i[s],
      l = i[s + r],
      u = i[s + a],
      _ = i[s + m],
      v = h + u,
      f = h - u,
      c = l + _,
      p = n * (l - _),
      d = v + c,
      y = f,
      g = -p,
      T = v - c,
      b = f,
      A = p;
    (e[t] = d),
      (e[t + 1] = 0),
      (e[t + 2] = y),
      (e[t + 3] = g),
      (e[t + 4] = T),
      (e[t + 5] = 0),
      (e[t + 6] = b),
      (e[t + 7] = A);
  };
});
var L = class {
  constructor(t) {
    this.frameSize = t;
    this.writePosition = 0;
    this.frames = [];
    this.buffer = new Float32Array(t * 2);
  }
  enqueue(t) {
    if (this.writePosition + t.length > this.buffer.length) {
      let s = new Float32Array(
        Math.max(this.buffer.length * 2, this.writePosition + t.length)
      );
      s.set(this.buffer), (this.buffer = s);
    }
    this.buffer.set(t, this.writePosition), (this.writePosition += t.length);
  }
  dequeue() {
    if (this.writePosition >= this.frameSize) {
      let t = 0;
      for (; this.writePosition - t >= this.frameSize; ) {
        let s = new Float32Array(this.frameSize);
        s.set(this.buffer.subarray(t, t + this.frameSize)),
          this.frames.push(s),
          (t += this.frameSize);
      }
      this.buffer.copyWithin(0, t, this.writePosition),
        (this.writePosition -= t);
    }
    return this.frames.shift();
  }
};
function ht(o) {
  let t = o.reduce((e, i) => e + i.length, 0),
    s = new Float32Array(t),
    r = 0;
  for (let e of o) s.set(e, r), (r += e.length);
  return s;
}
var _t = It(pt(), 1),
  k = class {
    constructor(t, s = 64) {
      this.sample_rate = t;
      this.fft_size = s;
      this.prim_thresh_e = 40;//
      this.prim_thresh_f_hz = 185;//185
      this.prim_thresh_sfm = 5;  //5
      this.frame_size_ms = 10;  //10 灵敏度麦克风
      this.is_speech_frame_counter = 0;
      this.is_silent_frame_counter = 0;
      this.e_min = null;
      this.f_min = null;
      this.sfm_min = null;
      this.frame_counter = 0;
      (this.fft = new _t.default(this.fft_size)),
        (this.frame_size = (this.sample_rate * this.frame_size_ms) / 1e3);
    }
    process(t) {
      let s = this.getSpectrum(Array.from(t));
      (s[0] = 0), this.frame_counter++;
      let r = 0;
      for (let f of t) r += f * f;
      let e = 0,
        i = 0,
        n = 0,
        a = 0;
      for (let [f, c] of s.entries()) {
        c > e && ((e = c), (i = f));
        let p = c > 0 ? c : 1;
        (n += Math.log(p)), (a += p);
      }
      let m = (i * this.sample_rate) / this.fft_size,
        h = -10 * Math.log10(Math.exp(n / s.length) / (a / s.length)),
        l = Number.isFinite(h) ? h : 0;
      (this.e_min === null || this.frame_counter < 30) &&
        ((this.e_min =
          this.e_min !== null && this.e_min > r && r !== 0 ? this.e_min : r),
        (this.f_min = this.f_min !== null && this.f_min > m ? m : this.f_min),
        (this.sfm_min =
          this.sfm_min !== null && this.sfm_min > l ? l : this.sfm_min));
      let u = 0,
        _ = this.prim_thresh_e * Math.log10(this.e_min || 1);
      r - (this.e_min || 0) >= _ && u++,
        e > 1 && m - (this.f_min || 0) >= this.prim_thresh_f_hz && u++,
        l > 0 && l - (this.sfm_min || 0) <= this.prim_thresh_sfm && u++;
      let v = u > 1;
      return (
        v
          ? (this.is_speech_frame_counter++, (this.is_silent_frame_counter = 0))
          : (this.is_silent_frame_counter++,
            (this.e_min =
              (this.is_silent_frame_counter * (this.e_min || 0) + r) /
              (this.is_silent_frame_counter + 1)),
            (this.is_speech_frame_counter = 0)),
        {
          is_speech: v,
          is_speech_frame_counter: this.is_speech_frame_counter,
          is_silent_frame_counter: this.is_silent_frame_counter,
        }
      );
    }
    getSpectrum(t) {
      for (; t.length < this.fft_size; ) t.push(0);
      let s = this.fft.toComplexArray(t, void 0),
        r = this.fft.createComplexArray();
      this.fft.realTransform(r, s);
      let e = new Array(r.length >>> 1);
      for (let i = 0; i < r.length; i += 2) {
        let n = r[i],
          a = r[i + 1];
        e[i >>> 1] = Math.sqrt(n * n + a * a);
      }
      return e.slice(0, e.length / 2 - 1);
    }
  };
var O = class {
  constructor(t) {
    this.isRecording = !1;
    this.frames = [];
    let s = t.sampleRate;
    (this.silentFramesThreshold = t.silentFramesThreshold ?? 20),
      (this.speechFramesThreshold = t.speechFramesThreshold ?? 10),
      (this.vad = new k(s)),
      (this.inputBuffer = new L(this.vad.frame_size));
  }
  process(t) {
    this.inputBuffer.enqueue(t);
    let s = [];
    for (;;) {
      let r = this.inputBuffer.dequeue();
      if (!r) break;
      let e = this.vad.process(r);
      if (this.isRecording)
        if (e.is_silent_frame_counter >= this.silentFramesThreshold) {
          s.push({ type: 'silence' }), (this.isRecording = !1);
          let i = ht(this.frames);
          (this.frames = []), s.push({ type: 'audioData', audioBuffer: i });
        } else this.frames.push(r);
      else
        e.is_speech_frame_counter >= this.speechFramesThreshold
          ? (s.push({ type: 'speech' }),
            (this.isRecording = !0),
            (this.frames = this.frames.slice(-this.speechFramesThreshold * 2)),
            this.frames.push(r))
          : this.frames.push(r);
    }
    return s;
  }
  flush() {
    if (this.frames.length === 0) return;
    let t = ht(this.frames);
    return (this.frames = []), { type: 'audioData', audioBuffer: t };
  }
};
var ct = class extends AudioWorkletProcessor {
  constructor(t) {
    super(t);
    let s = t?.processorOptions;
    (this.pipeline = new O({
      sampleRate: s.sampleRate,
      silentFramesThreshold: s.silentFramesThreshold,
      speechFramesThreshold: s.speechFramesThreshold,
    })),
      this.on((r) => {
        if (r.type === 'flush') {
          let e = this.pipeline.flush();
          e && this.post(e);
        }
      });
  }
  post(t) {
    if (t.type === 'audioData' && t.audioBuffer) {
      let s = [t.audioBuffer.buffer];
      this.port.postMessage(t, s);
    } else this.port.postMessage(t);
  }
  on(t) {
    this.port.onmessage = (s) => {
      t(s.data);
    };
  }
  process(t) {
    if (!t || !t[0] || !t[0][0]) return !0;
    let s = t[0][0],
      r = this.pipeline.process(s);
    for (let e of r) this.post(e);
    return !0;
  }
};
registerProcessor('AudioVADProcessor', ct);
