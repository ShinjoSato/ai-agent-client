## 録音時・再生時による粒子の広がりと色の変更を実装

### **🎯 修正ポイントまとめ**

---

### **1️⃣ `useState` ではなく `useRef` を使用**
✅ **変更点:**  
- `setParticleIntensity` と `setIsPlaying` の `state` 更新を `useRef` に置き換え  
- `useState` を使うと `useFrame` の更新と競合し、色や広がりが止まる問題が発生  

✅ **理由:**  
- `useRef` はコンポーネントの再レンダリングを引き起こさず、リアルタイムに値を保持できる  

```javascript
const particleIntensityRef = useRef(0);
const isPlayingRef = useRef(false);
```

---

### **2️⃣ `useFrame` 内で `uniforms` を毎フレーム更新**
✅ **変更点:**  
- `useFrame` の中で `uIntensity` と `uIsPlaying` を直接更新  

✅ **理由:**  
- `useEffect` で `isPlaying` を更新するとラグが発生する  
- `useFrame` の中でリアルタイムに `uniforms` を変更することでスムーズな動作を実現  

```javascript
useFrame(() => {
  ref.current.material.uniforms.uIntensity.value = particleIntensityRef.current;
  ref.current.material.uniforms.uIsPlaying.value = isPlayingRef.current ? 1.0 : 0.0;
});
```

---

### **3️⃣ `uIsPlaying` を `bool` ではなく `float` に変更**
✅ **変更点:**  
- `uniform bool uIsPlaying;` を `uniform float uIsPlaying;` に修正  

✅ **理由:**  
- `GLSL` では `bool` の `uniform` をうまく扱えないことがある  
- `1.0`（再生中）/ `0.0`（停止）で処理する方が安定する  

```glsl
uniform float uIsPlaying;
vec3 color = uIsPlaying > 0.5 ? vec3(1.0, 0.5, 0.0) : vec3(0.313, 0.784, 0.471);
```

---

### **4️⃣ `AudioProcessor` の `setParticleIntensity` の処理を `useRef` に保存**
✅ **変更点:**  
- `setParticleIntensity` の値を直接 `useRef` に代入  

✅ **理由:**  
- `setState` を毎回呼ぶと `React` の再レンダリングが発生し、フレーム更新がブロックされる  
- `useRef` に保存することで、パフォーマンスを維持しながらリアルタイム更新可能  

```javascript
setParticleIntensity={(intensity) => (particleIntensityRef.current = intensity)}
setIsPlaying={(playing) => (isPlayingRef.current = playing)}
```

---

### **🚀 まとめ**
| **修正点** | **内容** | **理由** |
|------------|---------|----------|
| ✅ `useState` → `useRef` に変更 | `particleIntensity` & `isPlaying` を管理 | `useState` だと更新が止まるため |
| ✅ `useFrame` 内で `uniforms` 更新 | `uIntensity` & `uIsPlaying` を `useFrame` でリアルタイム更新 | `useEffect` だとラグが発生するため |
| ✅ `uIsPlaying` を `float` に変更 | `uniform float uIsPlaying;` に修正 | `GLSL` の `bool` は安定しないため |
| ✅ `AudioProcessor` の `setParticleIntensity` を `useRef` に保存 | `setState` を直接呼ばない | `useState` を毎回呼ぶと `React` の再レンダリングが発生するため |

---

✨ **これにより、録音・再生時の「粒子の広がり」と「色の変化」がスムーズに動作するようになった！** 🚀  
何か追加の改善点があれば教えてください！🎶🔥