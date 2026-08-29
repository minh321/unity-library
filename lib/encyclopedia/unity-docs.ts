import type { DocLink } from "@/lib/encyclopedia/types";

/** Unity 6.0 LTS manual. Later 6.x pages keep the same slugs unless noted. */
export const U6 = "https://docs.unity3d.com/6000.0/Documentation/Manual";
export const U6API = "https://docs.unity3d.com/6000.0/Documentation/ScriptReference";
export const VFX17 = "https://docs.unity3d.com/Packages/com.unity.visualeffectgraph@17.0/manual";
export const SG17 = "https://docs.unity3d.com/Packages/com.unity.shadergraph@17.0/manual";
export const ADDR = "https://docs.unity3d.com/Packages/com.unity.addressables@2.2/manual";
export const NGO = "https://docs.unity3d.com/Packages/com.unity.netcode.gameobjects@2.2/manual";
export const UTF = "https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual";
export const HDRP17 = "https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.0/manual";

function d(title: string, url: string, note?: string): DocLink {
  return note ? { title, url, note } : { title, url };
}

const shared: Record<string, DocLink[]> = {
  home: [
    d("Unity 6.0 User Manual", `${U6}/index.html`, "Landing page for this LTS."),
    d("Choosing a render pipeline", `${U6}/choose-a-render-pipeline.html`),
    d("Choosing your particle system solution", `${U6}/ChoosingYourParticleSystem.html`),
  ],
  "role-and-product": [
    d("Unity 6.0 User Manual", `${U6}/index.html`),
    d("Multiplayer overview", `${U6}/multiplayer.html`),
    d("Universal Render Pipeline in Unity 6", `${U6}/urp/rendering-in-universalrp.html`),
  ],
  "study-path": [
    d("Profiler overview", `${U6}/Profiler.html`),
    d("Rendering in URP", `${U6}/urp/rendering-in-universalrp.html`),
    d("Choosing a render pipeline", `${U6}/choose-a-render-pipeline.html`),
  ],
  "honest-leadership": [
    d("Unity coding conventions", `${U6}/coding-conventions.html`),
    d("Version control", `${U6}/VersionControl.html`),
  ],
  "interview-playbook": [
    d("Profiler window", `${U6}/ProfilerWindow.html`),
    d("Event function execution order", `${U6}/execution-order.html`),
  ],
  "spoken-english": [
    d("Unity 6.0 User Manual", `${U6}/index.html`),
  ],
  stories: [
    d("Profiler overview", `${U6}/Profiler.html`),
    d("Memory Profiler package", "https://docs.unity3d.com/Packages/com.unity.memoryprofiler@1.1/manual/index.html"),
  ],
  cheatsheets: [
    d("Profiler overview", `${U6}/Profiler.html`),
    d("SRP Batcher", `${U6}/SRPBatcher.html`),
    d("Addressables memory management", `${ADDR}/MemoryManagement.html`),
  ],
  glossary: [
    d("Unity glossary", `${U6}/Glossary.html`),
    d("SRP Batcher", `${U6}/SRPBatcher.html`),
    d("GPU instancing", `${U6}/GPUInstancing.html`),
  ],
  checklists: [
    d("Profiler window", `${U6}/ProfilerWindow.html`),
    d("Frame Debugger", `${U6}/frame-debugger-window.html`),
    d("Rendering Debugger (URP)", `${U6}/urp/features/rendering-debugger.html`),
  ],
  resources: [
    d("Unity 6.0 User Manual", `${U6}/index.html`),
    d("Unity 6.0 Scripting API", `${U6API}/index.html`),
    d("Shader Graph 17 (Unity 6)", `${SG17}/index.html`),
    d("Visual Effect Graph 17 (Unity 6)", `${VFX17}/index.html`),
    d("Addressables", `${ADDR}/index.html`),
  ],
  csharp: [
    d("Scripting overview", `${U6}/scripting.html`),
    d("Garbage collection", `${U6}/performance-garbage-collection-best-practices.html`),
    d("Awaitable (Unity 6 async)", `${U6API}/Awaitable.html`, "Unity 6 player-loop awaitable."),
    d("Object lifetime and destruction", `${U6API}/Object.Destroy.html`),
  ],
  "solid-patterns": [
    d("Creating Gameplay", `${U6}/CreatingGameplay.html`),
    d("Object-oriented development", `${U6}/scripting.html`),
    d("Interfaces (C# language)", "https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/interfaces"),
  ],
  "unity-architecture": [
    d("Organizing your project", `${U6}/SpecialFolders.html`),
    d("Assembly definitions", `${U6}/ScriptCompilationAssemblyDefinitionFiles.html`),
    d("ScriptableObject", `${U6}/class-ScriptableObject.html`),
    d("Scenes and additive loading", `${U6}/MultiSceneEditing.html`),
  ],
  lifecycle: [
    d("Event function execution order", `${U6}/execution-order.html`),
    d("Awake", `${U6API}/MonoBehaviour.Awake.html`),
    d("OnApplicationPause", `${U6API}/MonoBehaviour.OnApplicationPause.html`),
    d("Coroutines", `${U6}/Coroutines.html`),
  ],
  profiling: [
    d("Profiler overview", `${U6}/Profiler.html`),
    d("Profiler window", `${U6}/ProfilerWindow.html`),
    d("Profile Analyzer", "https://docs.unity3d.com/Packages/com.unity.performancetools@1.0/manual/profile-analyzer.html"),
    d("Memory Profiler", "https://docs.unity3d.com/Packages/com.unity.memoryprofiler@1.1/manual/index.html"),
    d("Analyze your project in URP", `${U6}/urp/analyze-your-project.html`),
  ],
  rendering: [
    d("SRP Batcher", `${U6}/SRPBatcher.html`),
    d("Draw call batching", `${U6}/DrawCallBatching.html`),
    d("GPU instancing", `${U6}/GPUInstancing.html`),
    d("Occlusion culling", `${U6}/OcclusionCulling.html`),
    d("Level of Detail", `${U6}/LevelOfDetail.html`),
    d("GPU Resident Drawer (URP, Unity 6)", `${U6}/urp/gpu-resident-drawer.html`),
  ],
  assets: [
    d("Addressables overview", `${ADDR}/index.html`),
    d("Addressables memory management", `${ADDR}/MemoryManagement.html`),
    d("AssetBundles", `${U6}/AssetBundlesIntro.html`),
    d("Resources folder", `${U6}/LoadingResourcesatRuntime.html`),
  ],
  "animation-physics": [
    d("Animator component", `${U6}/class-Animator.html`),
    d("Animation clips", `${U6}/AnimationClips.html`),
    d("Rigidbody", `${U6}/class-Rigidbody.html`),
    d("Physics overview", `${U6}/PhysicsOverview.html`),
  ],
  ui: [
    d("Canvas", `${U6}/UICanvas.html`),
    d("UI and UI Toolkit", `${U6}/UIToolkits.html`),
    d("Input System", "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.11/manual/index.html"),
  ],
  networking: [
    d("Unity multiplayer", `${U6}/multiplayer.html`),
    d("Netcode for GameObjects", `${NGO}/index.html`),
    d("Network authority", `${NGO}/basics/networkobject.html`),
  ],
  platforms: [
    d("Android player settings", `${U6}/class-PlayerSettingsAndroid.html`),
    d("iOS", `${U6}/iphone.html`),
    d("IL2CPP", `${U6}/IL2CPP.html`),
    d("OnApplicationPause", `${U6API}/MonoBehaviour.OnApplicationPause.html`),
  ],
  "testing-incidents": [
    d("Unity Test Framework", `${UTF}/index.html`),
    d("Play Mode vs Edit Mode tests", `${UTF}/edit-mode-vs-play-mode-tests.html`),
    d("Crash reporting", `${U6}/crash-reporting.html`),
  ],
  requirements: [
    d("Unity 6.0 User Manual", `${U6}/index.html`),
    d("Quality settings", `${U6}/class-QualitySettings.html`),
  ],
  "team-leadership": [
    d("Unity coding conventions", `${U6}/coding-conventions.html`),
    d("Version control integrations", `${U6}/VersionControl.html`),
  ],
  "ai-workflow": [
    d("Unity 6.0 User Manual", `${U6}/index.html`),
    d("Scripting API", `${U6API}/index.html`),
  ],
  "question-bank": [
    d("Execution order", `${U6}/execution-order.html`),
    d("Profiler", `${U6}/Profiler.html`),
    d("SRP Batcher", `${U6}/SRPBatcher.html`),
  ],
  "vfx-explained": [
    d("Choosing your particle system solution", `${U6}/ChoosingYourParticleSystem.html`, "Particle System vs VFX Graph. Official chooser."),
    d("VFX Graph — Getting started", `${VFX17}/GettingStarted.html`, "Unity’s own first page. Read this after the kitchen metaphor."),
    d("Shader Graph window", `${SG17}/Shader-Graph-Window.html`, "Unity’s own first page for Shader Graph."),
    d("Creating advanced VFX in Unity 6 (official e-book)", "https://unity.com/resources/creating-advanced-vfx-unity6", "Download Unity’s PDF. This library does not reprint it."),
  ],
  "vfx-graph-plain": [
    d("VFX Graph — Getting started", `${VFX17}/GettingStarted.html`, "Install, first graph, Simulate/Render."),
    d("Graph logic and philosophy", `${VFX17}/GraphLogicAndPhilosophy.html`, "Contexts, blocks vs operators, processing order."),
    d("VFX Graph 17 Manual (index)", `${VFX17}/index.html`, "TOC for the rest of the package."),
    d("System requirements", `${VFX17}/System.html`, "Compute, URP/HDRP. The refusal list."),
  ],
  "shader-plain": [
    d("Shader Graph 17 Manual (index)", `${SG17}/index.html`, "TOC."),
    d("Shader Graph window", `${SG17}/Shader-Graph-Window.html`, "Blackboard, Master Stack, Graph Settings."),
    d("Master Stack", `${SG17}/Master-Stack.html`, "Vertex vs fragment — the only things that shade."),
    d("Keywords", `${SG17}/Keywords.html`, "Variant tax."),
  ],
  "vfx-plus-shader": [
    d("Working with Shader Graph in VFX Graph", `${VFX17}/sg-working-with.html`, "Unity 6 Support VFX Graph + dedicated outputs. Do not invent node names."),
    d("Output Particle Shader Graph Mesh", `${VFX17}/Context-OutputShaderGraphMesh.html`, "One of the dedicated Shader Graph outputs."),
    d("Shader Graph 17 Manual", `${SG17}/index.html`, "Search for Support VFX Graph."),
    d("Creating shaders with Shader Graph (Unity 6 Manual)", `${U6}/shader-graph.html`, "URP and HDRP both ship Shader Graph. Confirm VFX integration on the VFX Graph 17 page."),
  ],
  "vfx-learn-by-doing": [
    d("Sample: Learning Templates", `${VFX17}/sample-learningTemplates.html`, "Unity’s official learning sample. This is the homework."),
    d("Realistic lighting with 6-way lighting in Unity (blog)", "https://blog.unity.com/engine-platform/realistic-lighting-with-6-way-lighting-in-unity", "Public Unity blog. HDRP-first historically — verify URP on your package."),
    d("Creating advanced VFX in Unity 6 (e-book download)", "https://unity.com/resources/creating-advanced-vfx-unity6", "After templates, read the PDF. This library does not copy it."),
    d("Frame Debugger", `${U6}/frame-debugger-window.html`, "See the transparent pass before you “optimize.”"),
  ],
  "vfx-ta-interview": [
    d("Choosing your particle system solution", `${U6}/ChoosingYourParticleSystem.html`),
    d("Visual Effect Graph 17 (Unity 6)", `${VFX17}/index.html`),
    d("Shader Graph 17 (Unity 6)", `${SG17}/index.html`),
    d("Rendering in URP", `${U6}/urp/rendering-in-universalrp.html`),
    d("Advanced VFX in Unity 6 e-book", "https://unity.com/resources/creating-advanced-vfx-unity6"),
  ],
  "particle-system": [
    d("Choosing your particle system solution", `${U6}/ChoosingYourParticleSystem.html`),
    d("Create and view a Particle System", `${U6}/PartSysUsage.html`),
    d("Particle System component reference", `${U6}/class-ParticleSystem.html`),
    d("Particle System modules", `${U6}/ParticleSystemModules.html`),
    d("Particle System Renderer", `${U6}/PartSysRendererModule.html`),
    d("Particle GPU instancing", `${U6}/PartSysInstancing.html`),
    d("ParticleSystem API", `${U6API}/ParticleSystem.html`),
    d("Particle System Force Field", `${U6}/class-ParticleSystemForceField.html`),
  ],
  "vfx-graph": [
    d("Visual Effect Graph overview (Unity 6 / v17)", `${VFX17}/index.html`),
    d("What's new in VFX Graph 17 / Unity 6", `${VFX17}/whats-new-17.html`),
    d("Getting started", `${VFX17}/GettingStarted.html`),
    d("Graph logic", `${VFX17}/GraphLogicAndPhilosophy.html`),
    d("Working with Shader Graph in VFX Graph", `${VFX17}/sg-working-with.html`),
    d("Output Particle Shader Graph Mesh", `${VFX17}/Context-OutputShaderGraphMesh.html`),
    d("System requirements", `${VFX17}/System.html`),
  ],
  "shader-graph": [
    d("Shader Graph 17 manual", `${SG17}/index.html`),
    d("Install Shader Graph", `${SG17}/install-shader-graph.html`),
    d("Shader Graph window", `${SG17}/Shader-Graph-Window.html`),
    d("Master Stack", `${SG17}/Master-Stack.html`),
    d("Keywords", `${SG17}/Keywords.html`),
    d("Precision modes", `${SG17}/Precision-Modes.html`),
    d("Working with Shader Graph in VFX Graph", `${VFX17}/sg-working-with.html`),
  ],
  "render-pipelines": [
    d("Choosing a render pipeline", `${U6}/choose-a-render-pipeline.html`),
    d("Rendering in the Universal Render Pipeline", `${U6}/urp/rendering-in-universalrp.html`),
    d("What's new in URP 17 (Unity 6.0)", "https://docs.unity3d.com/Manual/urp/whats-new/urp-whats-new.html"),
    d("Upgrade to URP 17 (Unity 6.0)", `${U6}/urp/upgrade-guide-unity-6.html`),
    d("SRP Batcher", `${U6}/SRPBatcher.html`),
    d("GPU Resident Drawer", `${U6}/urp/gpu-resident-drawer.html`),
    d("Analyze a render graph in URP", `${U6}/urp/render-graph-view.html`),
    d("Custom render pass workflow in URP", `${U6}/urp/renderer-features/custom-rendering-pass-workflow-in-urp.html`),
    d("HDRP 17 documentation", `${HDRP17}/index.html`),
  ],
  "vfx-performance": [
    d("Choosing your particle system solution", `${U6}/ChoosingYourParticleSystem.html`),
    d("Particle System Renderer", `${U6}/PartSysRendererModule.html`),
    d("Analyze your project in URP", `${U6}/urp/analyze-your-project.html`),
    d("Frame Debugger", `${U6}/frame-debugger-window.html`),
    d("Rendering Debugger (URP)", `${U6}/urp/features/rendering-debugger.html`),
    d("Overdraw and fill rate (batching page)", `${U6}/DrawCallBatching.html`),
  ],
  "vfx-question-bank": [
    d("Choosing your particle system solution", `${U6}/ChoosingYourParticleSystem.html`),
    d("VFX Graph 17 / Unity 6", `${VFX17}/whats-new-17.html`),
    d("Shader Graph keywords", `${SG17}/Keywords.html`),
    d("GPU Resident Drawer", `${U6}/urp/gpu-resident-drawer.html`),
  ],
  ebook: [
    d("Unity 6.0 User Manual", `${U6}/index.html`),
    d("Unity 6.0 Scripting API", `${U6API}/index.html`),
    d("Programming in Unity", `${U6}/scripting.html`),
    d("C# style guide e-book (Unity 6)", "https://unity.com/resources/c-sharp-style-guide-unity-6"),
  ],
  "ebook-unity6": [
    d("New in Unity 6.0", `${U6}/WhatsNewUnity6.html`),
    d("Unity 6.0 User Manual", `${U6}/index.html`),
    d("GPU Resident Drawer", `${U6}/urp/gpu-resident-drawer.html`),
    d("Multiplayer overview", `${U6}/multiplayer.html`),
  ],
  "ebook-manual": [
    d("Unity 6.0 User Manual", `${U6}/index.html`),
    d("Programming in Unity", `${U6}/scripting.html`),
    d("Choose a render pipeline", `${U6}/choose-a-render-pipeline.html`),
    d("Animation (Mecanim)", `${U6}/AnimationOverview.html`),
    d("Lighting configuration workflow", `${U6}/lighting-configuration-workflow.html`),
    d("UI toolkits", `${U6}/UIToolkits.html`),
  ],
  "ebook-scripting": [
    d("Programming in Unity", `${U6}/scripting.html`),
    d("Object-oriented development", `${U6}/object-oriented-development.html`),
    d("Unity programming best practices", `${U6}/programming-best-practices.html`),
    d("Script compilation", `${U6}/script-compilation.html`),
    d("Organizing scripts into assemblies", `${U6}/assembly-definition-files.html`),
    d("Scripting API home", `${U6API}/index.html`),
  ],
  "ebook-api-core": [
    d("UnityEngine.CoreModule", `${U6API}/UnityEngine.CoreModule.html`),
    d("Object", `${U6API}/Object.html`),
    d("GameObject", `${U6API}/GameObject.html`),
    d("GameObject constructor", `${U6API}/GameObject-ctor.html`),
    d("Component", `${U6API}/Component.html`),
    d("MonoBehaviour", `${U6API}/MonoBehaviour.html`),
    d("Transform", `${U6API}/Transform.html`),
    d("ScriptableObject", `${U6API}/ScriptableObject.html`),
  ],
  "ebook-api-loop": [
    d("Event function execution order", `${U6}/execution-order.html`),
    d("Asynchronous programming with Awaitable", `${U6}/async-await-support.html`),
    d("Introduction to Awaitable", `${U6}/async-awaitable-introduction.html`),
    d("Awaitable completion and continuation", `${U6}/async-awaitable-continuations.html`),
    d("Awaitable API", `${U6API}/Awaitable.html`),
    d("RuntimeInitializeOnLoadMethodAttribute", `${U6API}/RuntimeInitializeOnLoadMethodAttribute.html`),
    d("Time", `${U6API}/Time.html`),
  ],
  "ebook-graphics": [
    d("Choose a render pipeline", `${U6}/choose-a-render-pipeline.html`),
    d("Lighting configuration workflow", `${U6}/lighting-configuration-workflow.html`),
    d("Light Modes", `${U6}/LightModes-introduction.html`),
    d("Rendering in URP", `${U6}/urp/rendering-in-universalrp.html`),
    d("GPU Resident Drawer", `${U6}/urp/gpu-resident-drawer.html`),
    d("Camera API", `${U6API}/Camera.html`),
  ],
  "ebook-simulation": [
    d("Introduction to Mecanim", `${U6}/AnimationOverview.html`),
    d("Physics overview", `${U6}/PhysicsOverview.html`),
    d("Optimize physics CPU", `${U6}/physics-optimization-cpu.html`),
    d("Choosing your particle system solution", `${U6}/ChoosingYourParticleSystem.html`),
    d("Animator", `${U6API}/Animator.html`),
    d("Rigidbody", `${U6API}/Rigidbody.html`),
  ],
  "ebook-ui": [
    d("UI toolkits", `${U6}/UIToolkits.html`),
    d("Introduction to UI Toolkit", `${U6}/best-practice-guides/introduction-to-ui-toolkit.html`),
    d("Canvas", `${U6}/UICanvas.html`),
    d("Input System", "https://docs.unity3d.com/Packages/com.unity.inputsystem@1.11/manual/index.html"),
  ],
  "ebook-content": [
    d("Addressables overview", `${ADDR}/index.html`),
    d("Addressables memory management", `${ADDR}/MemoryManagement.html`),
    d("AssetBundles", `${U6}/AssetBundlesIntro.html`),
    d("Package Manager window", `${U6}/upm-ui.html`),
    d("ScriptableObject API", `${U6API}/ScriptableObject.html`),
  ],
  "ebook-ship": [
    d("Profiler overview", `${U6}/Profiler.html`),
    d("Frame Debugger", `${U6}/frame-debugger-window.html`),
    d("Multiplayer overview", `${U6}/multiplayer.html`),
    d("Netcode for GameObjects", `${NGO}/index.html`),
    d("IL2CPP", `${U6}/IL2CPP.html`),
    d("OnApplicationPause", `${U6API}/MonoBehaviour.OnApplicationPause.html`),
  ],
  "ebook-unity-books": [
    d("Programming in Unity (e-book list)", `${U6}/scripting.html`),
    d("C# style guide (Unity 6 edition)", "https://unity.com/resources/c-sharp-style-guide-unity-6"),
    d("Design patterns and SOLID e-book", "https://unity.com/resources/design-patterns-solid-ebook"),
    d("ScriptableObjects architecture e-book", "https://unity.com/resources/create-modular-game-architecture-with-scriptable-objects-ebook"),
    d("ScriptableObjects Unity 6 edition", "https://unity.com/resources/create-modular-game-architecture-scriptableobjects-unity-6"),
    d("Introduction to DOTS e-book", "https://unity.com/resources/introduction-to-dots-ebook"),
    d("Advanced VFX in Unity 6 e-book", "https://unity.com/resources/creating-advanced-vfx-unity6"),
    d("VFX Graph Unity 6 e-book blog", "https://unity.com/blog/unity-6-vfx-graph-ebook"),
    d("URP for advanced creators (Unity 6)", "https://unity.com/resources/introduction-to-urp-advanced-creators-unity-6"),
  ],
};

export function docsFor(articleId: string): DocLink[] {
  return shared[articleId] ?? [d("Unity 6.0 User Manual", `${U6}/index.html`)];
}

export function formatDocsForChat(docs: DocLink[] | undefined, limit = 4) {
  if (!docs?.length) return "";
  return (
    "\n\nUnity 6 documentation for this article:\n" +
    docs
      .slice(0, limit)
      .map((x) => `• ${x.title} — ${x.url}`)
      .join("\n")
  );
}
