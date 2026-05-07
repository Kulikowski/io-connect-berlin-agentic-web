# 🚀 Practical steps to make your website agent-ready
**IO Connect Hands-on Workshop**

In this workshop, we are going to make two simple websites **agent-ready**. By the end, you will expose tools using both imperative and declarative WebMCP APIs, enabling AI agents to interact with them programmatically and reliably.

> [!IMPORTANT]
> * **Workshop Directory:** All hands-on coding during the workshop should take place inside the [base](./base) directory.
> * **Completed Examples:** If you need a reference or get stuck, the finished code and ready-made examples are available in the [final](./final) directory.

## 🛠️ Prerequisites & Setup

Before starting the workshop, ensure you have the following technical requirements set up:

### 1. Browser Configuration
* **Chrome:** Version `150` or higher is required.
* **Feature Flags:** Navigate to the following addresses and enable the flags (then restart the browser):
  * `chrome://flags/#enable-webmcp-testing` (Enables the core WebMCP APIs)
* **Model Context Tool Inspector:** Ensure the WebMCP [debugging extension](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd?pli=1) is installed for verifying and triggering tools.

### 2. Environment & CLI Tools
* **Antigravity IDE & Antigravity CLI:** Install the [Antigravity IDE](https://antigravity.google/product/antigravity-ide) or [Antigravity CLI](https://antigravity.google/product/antigravity-cli).
* **Gemini API Key:** Ensure your `GEMINI_API_KEY` is retrieved from [Google AI Studio](https://aistudio.google.com/api-keys) and configured in your local environment.
* **Modern Web Guidance:** Verify that the [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance#-quickstart) is installed.

> [!TIP]
> **Running the Demo Website:**
> You can run the demo website on a specific port using:
> ```bash
> npx http-server --port=8080 -c-1
> ```
> *Note:* When making changes to the website, and running it without `-c-1` you may need to clear your browser's cache to ensure the most up-to-date state is loaded. Local storage is used to keep track of todos, so if you want clean state you need to clear local storage in **Application > Local Storage** in Chrome DevTools.

---

## 📅 Agenda & Lab Steps

| Step | Topic | Application | Key Concept |
| :--- | :--- | :--- | :--- |
| **1.1** | [Implement Imperative WebMCP](#11-implement-imperative-webmcp) | Todo List | Register tools using JavaScript (`registerTool`), user confirmations |
| **1.2** | [Validate with DevTools (Imperative)](#12-validate-with-devtools-imperative) | Todo List | Checking registered tools, tools activity |
| **2.1** | [Implement Declarative WebMCP](#21-implement-declarative-webmcp) | French Bistro | Declarative forms, auto-submit |
| **2.2** | [Validate with DevTools (Declarative)](#22-validate-with-devtools-declarative) | French Bistro | Checking form fields mapping, real-time input filling |
| **3.1** | [Debug Imperative Tool](#31-debug-imperative-tool) | Todo List | Breakpoints, Testing |
| **4.1** | [Lighthouse Agentic Web Audit](#41-lighthouse-agentic-web-audit) | Both Apps | Audit prepared web-pages for agentic readiness |

---

### Task 1: Imperative WebMCP & DevTools Verification

#### 1.1. Implement Imperative WebMCP
**Topic:** Imperative API & Tool Lifecycle (Todo List App)

In this exercise, you will register a tool programmatically using JavaScript. This allows the application to dynamically share tools based on route, user actions, or page state.

##### 🎯 Goal
Use the **Modern Web Guidance** skill via the Antigravity CLI or IDE to register a WebMCP tools that handle interactions with the todo list items.

> [WARNING]
> **Safety Guardrails:** Never let an AI agent perform destructive or irreversible actions without manual user review/confirmation outside the agent's control.

---

#### 1.2. Validate with DevTools (Imperative)
**Topic:** Active Tool Registry & Activity Log

Verify that your newly created imperative WebMCP tool is correctly registered in the browser's active registry.

##### 🎯 Action Steps
1. Open Chrome DevTools and navigate to the **Application** panel.
2. In the left-hand sidebar, locate the **WebMCP** section.
3. Verify that your tools are correctly detected and listed under the registered active tools.
4. Use the DevTools panel to trigger a manual invocation or use the debugging extension:
   - Check the **Tool Activity Log** to see the parameters, status, and the JSON output returned by your tool.
5. Trace back from DevTools to see where the tool registry code is defined in your sources.

---

### Task 2: Declarative WebMCP & DevTools Verification

#### 2.1. Implement Declarative WebMCP
**Topic:** Declarative Forms API (French Bistro Booking)

Declarative WebMCP allows you to expose standard HTML forms as tools to AI agents using HTML attributes alone.

##### 🎯 Goal
Use the **Modern Web Guidance** skill via the Antigravity CLI or IDE to enable an AI agent to book a reservation at the Le Petit Bistro restaurant by annotating the booking form.

> [!NOTE]
> **To Auto-Submit or Not?**
> Assess if this booking form should include the `toolautosubmit` attribute. If it's a critical or transactional booking, omitting it allows the user to review the filled fields before manually confirming.

##### 🎮 Play with Queries
Once annotated, try querying the agent:
* *"I'd like to book a table for 3 people tomorrow at 7 PM under the name Alex."*
* Observe how the agent automatically maps and populates these values!

---

#### 2.2. Validate with DevTools (Declarative)
**Topic:** Declarative Tool Active Registry & Field Mapping

Verify that your newly annotated declarative form is recognized by the browser.

##### 🎯 Action Steps
1. Navigate to the **Application** panel in DevTools and select the **WebMCP** section.
2. Confirm that `book_restaurant_table` is registered in the list of active tools.
3. Inspect the schema generated by the browser. Observe how form field attributes (such as `required`, type specifications, options in `<select>`) have been translated into JSON Schema parameters.
4. Use the manual test invocation in DevTools:
   - Input test variables for name, date, time, and guests.
   - Execute the tool call and verify that the values are dynamically filled in the form fields.
   - Inspect the return status in the **Tool Activity Log** after submission to verify the success response.

---

### Task 3: Debug Imperative Tool

#### 3.1. Debug Imperative Tool
**Topic:** Interactive DevTools Debugging

Learn the debugging pattern for diagnosing execution flow within your imperative tool.

##### 🎯 Action Steps
1. Navigate to the **Sources** panel in DevTools.
2. Open `app.js` and set a breakpoint on the first line inside your tool's `execute` callback.
3. Open the **WebMCP** panel in DevTools and trigger a tool invocation with custom parameters.
4. Watch the execution freeze on your breakpoint. Step through the execution lines to examine variables.
5. Inspect the status (e.g. `Success` or `Error`) and parameters within the **Tool Activity Log** to see the final output.

---

### Task 4: Lighthouse Agentic Web Audit

#### 4.1. Lighthouse Agentic Web Audit
**Topic:** Agentic Browsing Verification

The experimental **Agentic Browsing** audit in Lighthouse verifies that a website works well with AI agents.

##### 🚀 Action Steps
Run the Lighthouse Agentic Web Audit in Chrome DevTools (Lighthouse panel).

---

## 🎓 Conclusion & Resources

* **Evals (Evaluations):** Used for testing non-deterministic agent interactions. Since agents can select various paths to accomplish a task, standard unit tests aren't sufficient. Evals ensure consistent and safe outcomes.
* **Additional Resources:**
  * **[WebMCP Documentation](https://developer.chrome.com/docs/ai/webmcp)** — Chrome developer guide, specifications, and browser flags.
  * **[Lighthouse GitHub Repository](https://github.com/GoogleChrome/lighthouse)** — Main project repository for Lighthouse.
  * **[GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools)** — Demo examples, extensions, and the experimental **Evals CLI**.