# 🚀 Practical steps to make your website agent-ready
**IO Connect Hands-on Workshop**

In this hands-on workshop, you will make two web applications **agent-ready**. By the end of this session, you will expose tools using both **imperative** and **declarative** WebMCP APIs, enabling AI agents to interact with your websites programmatically and reliably.

## 📑 Table of Contents
- [🛠️ Prerequisites & Pre-Flight Verification](#️-prerequisites--pre-flight-verification)
- [🚀 Quickstart: Launch the Workshop Server](#-quickstart-launch-the-workshop-server)
- [📅 Workshop Agenda](#-workshop-agenda)
- [Task 1: Declarative WebMCP & DevTools Verification (French Bistro)](#task-1-declarative-webmcp--devtools-verification-french-bistro)
- [Task 2: Imperative WebMCP & DevTools Verification (Todo App)](#task-2-imperative-webmcp--devtools-verification-todo-app)
- [Task 3: Debug Imperative Tool Execution](#task-3-debug-imperative-tool-execution)
- [Task 4: Lighthouse Agentic Readiness Audit](#task-4-lighthouse-agentic-readiness-audit)
- [🎓 Conclusion & Additional Resources](#-conclusion--additional-resources)

---

## 🛠️ Prerequisites & Pre-Flight Verification

Verify that your local environment meets the following requirements:

### 1. Browser Configuration
* **Chrome:** Version `150` ([Check version in `chrome://settings/help`](chrome://settings/help)).
* **Enable WebMCP Flags:** Copy and paste the following URL into Chrome, enable the flag, and **relaunch your browser**:
  ```text
  chrome://flags/#enable-webmcp-testing
  ```
* **Install Inspector Extension:** Install the [Model Context Tool Inspector](https://chromewebstore.google.com/detail/webmcp-model-context-tool/gbpdfapgefenggkahomfgkhfehlcenpd?pli=1) extension to inspect and trigger tools during exercises. This will enable you to test your WebMCP implementation locally.
* **Gemini API Key:** To use the Gemini integration of the extension, you will need a Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/api-keys).  


> [!IMPORTANT]
> * **Working folder:** All hands-on coding during this workshop must take place inside the **[`base/`](./base)** directory.
> * **Reference Solutions:** If you get stuck or need to check working implementations, complete solutions are available in the **[`final/`](./final)** directory. Every task is modular—you can switch to a `final/` folder at any point without losing momentum!

---

## 🚀 Quickstart: Launch the Workshop Server

To serve the local workshop applications without caching issues, open your terminal at the **root of this repository** and run:

```bash
npx http-server base --port=8080 -c-1
```
*(The `-c-1` flag disables browser caching, ensuring your code edits reload instantly).*

Once running, keep this terminal window open and open two tabs in Chrome:
* **Todo List App:** [http://localhost:8080/todo-list/](http://localhost:8080/todo-list/)
* **Le Petit Bistro App:** [http://localhost:8080/french-bistro/](http://localhost:8080/french-bistro/)

> [!TIP]
> **💡 Pro tip: Refreshing cache**  
> The Todo List app saves tasks in `localStorage`. To start from scratch or refresh the initial tasks, open **Chrome DevTools**, navigate to the `Application` tab, and clear local storage. Alternatively, you can open the Chrome DevTools Console (`Ctrl+Shift+J` or `Cmd+Option+J`) while on the app page and run:
> ```javascript
> localStorage.clear(); location.reload();
> ```

---

## 📅 Workshop Agenda


| Step | Topic | Workspace Directory | Key Concepts |
| :---: | :--- | :--- | :--- |
| **Task 1** | [Declarative WebMCP & DevTools](#task-1-declarative-webmcp--devtools-verification-french-bistro) | [`base/french-bistro/`](./base/french-bistro/) | Declarative HTML form tools, `toolautosubmit` attribute, schema mapping |
| **Task 2** | [Imperative WebMCP & DevTools](#task-2-imperative-webmcp--devtools-verification-todo-app) | [`base/todo-list/`](./base/todo-list/) | `registerTool()` JavaScript API, tool activity logging, user safety confirmations |
| **Task 3** | [Interactive DevTools Debugging](#task-3-debug-imperative-tool-execution) | [`base/todo-list/`](./base/todo-list/) | Source breakpoints, execution flow, diagnostic inspection |
| **Task 4** | [Lighthouse Agentic Readiness Audit](#task-4-lighthouse-agentic-readiness-audit) | Both Applications | Automated verification of AI agent compatibility using Lighthouse |


---
## Task 1: Declarative WebMCP & DevTools Verification (French Bistro)

Declarative WebMCP exposes standard HTML forms as tools to AI agents using pure HTML attributes (`toolname`, `tooldescription`, `toolparamdescription`). Zero JavaScript registration is required!

### 💡 Conceptual Primer: Declarative Attributes
* **`toolname`** *(on `<form>`)*: The name exposed to the AI agent (e.g., `book_table_le_petit_bistro`).
* **`tooldescription`** *(on `<form>`)*: Explains what submitting this form accomplishes.
* **`toolautosubmit`** *(on `<form>` - Optional)*: If present, the browser automatically submits the form upon tool invocation. If omitted, the agent populates the fields but **waits for the human user to click Submit**.
* **`toolparamdescription`** *(on `<input>`, `<select>`, `<textarea>`)*: Describes parameter constraints and formatting requirements (e.g., `YYYY-MM-DD`).

---

### 1.1. Annotate the Bistro Booking Form (`index.html`)

1. Open **[http://localhost:8080/french-bistro/](http://localhost:8080/french-bistro/)** in Chrome.
2. In your IDE, open **`base/french-bistro/index.html`** and locate `<form id="reservationForm">` (**line 35**).
3. Add `toolname` and `tooldescription` directly to the `<form>` tag:
   ```html
   <form
     id="reservationForm"
     toolname="book_table_le_petit_bistro"
     tooldescription="Initiates a dining reservation request at Le Petit Bistro. Accepts customer details, timing, and seating preferences."
     novalidate
   >
   ```
4. Annotate each input field (`#name`, `#phone`, `#date`, `#time`, `#guests`, `#seating`) with `toolparamdescription` attributes explaining what they expect.
5. Save **`index.html`** and reload the page in Chrome.

> [!NOTE]
> **To Auto-Submit or Not? (Engineering Trade-off)**  
> Notice that we did **not** add `toolautosubmit` to `reservationForm`. Because booking a restaurant table is a transactional commitment, omitting `toolautosubmit` lets the user visually review the AI-populated fields before clicking **Request Reservation** themselves!

---

### ✅ Checkpoint 1.2: Verify Schema Mapping & Agent Testing

Let's verify how the browser translates your HTML attributes into an active tool schema!

1. In Chrome DevTools (`F12`), navigate to **Application > WebMCP > Active Tools**.
2. Click **`book_table_le_petit_bistro`** and select the **Schema** tab.
3. Observe how your HTML `required` attributes became `"required": ["name", ...]` and how `<select id="guests">` options (`1` through `6`) automatically became a JSON Schema `"enum"` array!

#### 🎮 Test Your Agent ("Break the Agent!")
Open the **Model Context Tool Inspector** extension on the French Bistro page and test these natural language queries:

1. **🌟 The Happy Path:**  
   *"I'd like to book a table for 3 people tomorrow at 7 PM under the name Alex."*  
   👉 *Watch the form fields magically populate right before your eyes!*

2. **🧠 The Reasoning Challenge:**  
   *"Can you get me a table for 2 this coming Friday around dinner time? My name is Marie."*  
   👉 *Notice how the agent infers a future date and picks a standard dinner slot (19:00)!*

3. **🛡️ The Constraint Test (Break the Agent!):**  
   *"Book a table for 20 people tonight."*  
   👉 *See what happens! Because your declarative `<select id="guests">` schema restricts values to `1-6`, the browser informs the agent of this constraint, preventing invalid inputs from reaching your server.*

---

## Task 2: Imperative WebMCP & DevTools Verification (Todo App)

Imperative WebMCP allows your application to register tools dynamically using JavaScript (`document.modelContext.registerTool()`) based on route changes, user authentication, or page state.

### 💡 Why Imperative WebMCP?
Every imperative tool requires four core properties:
1. `name`: Unique identifier for the AI agent (`snake_case`).
2. `description`: Clear instructions telling the agent *when* and *how* to use the tool.
3. `inputSchema`: A JSON Schema defining required parameters and their data types.
4. `execute`: The callback function invoked when the agent executes the tool.

---

### 2.1. Implement Imperative Tools (`app.js`)

1. Open **[http://localhost:8080/todo-list/](http://localhost:8080/todo-list/)** in Chrome.
2. In your IDE, open **`base/todo-list/app.js`** and scroll to **line 386** (`function registerWebMCPTools()`).
3. Notice that we have provided commented-out stubs for 5 core tools (`Tool 0` through `Tool 4`).
4. **Your Task:** Uncomment `Tool 0 (get_todos)` and `Tool 1 (add_todo)`. Fill in their `name`, `description`, `inputSchema`, and `execute` handlers so they call `getTodos()` and `addTodo(text)`.
5. **AI-Assisted Guidance:** If using Antigravity with the **Modern Web Guidance** skill, prompt your assistant:
   > *"Using the Modern Web Guidance skill, examine `base/todo-list/app.js` and register imperative WebMCP tools for `get_todos` and `add_todo` inside `registerWebMCPTools()`."*
6. Save **`app.js`** and hard-refresh your browser (`Ctrl+Shift+R` / `Cmd+Shift+R`).

> [!WARNING]
> **Safety Guardrails for Destructive Actions:**  
> Never allow an AI agent to execute destructive actions (such as deleting tasks or processing payments) without requiring explicit manual user confirmation! When you inspect `Tool 3 (delete_todo)`, notice how it triggers `showDeleteConfirmDialog(todo.text)` before mutating data, keeping a human in the loop.

---

### ✅ Checkpoint 2.2: Verify & Test in Chrome DevTools

Let's verify that the browser has registered your JavaScript tools and test an agent invocation!

1. Open **Chrome DevTools (`F12`)**, navigate to the **Application** tab, and expand **WebMCP > Active Tools** in the left sidebar.
2. **Verify Registry:** Confirm that `get_todos` and `add_todo` are listed.
3. **Manual Invocation Test:**
   * Select `add_todo` in the DevTools panel (or open your **Model Context Tool Inspector** extension).
   * In the **Test Parameters** box, enter:
     ```json
     { "text": "Buy coffee beans for the workshop" }
     ```
   * Click **Execute Tool**.
4. **Observe the Result:** Check the **Tool Activity Log** in DevTools to confirm `Status: Success`. Look at your webpage—the new task *"Buy coffee beans for the workshop"* will appear instantly in your UI!

> [!TIP]
> **🚀 Fast Finisher Bonus Challenge:**  
> Finished early? Uncomment and complete `Tool 2 (edit_todo)`, `Tool 3 (delete_todo)`, and `Tool 4 (toggle_todo)`. Test them in DevTools to see how the confirmation modal protects against accidental deletions!

---



## Task 3: Debug Imperative Tool Execution

Learn the debugging workflow for diagnosing execution flow and parameter handling within imperative WebMCP tools.

### 3.1. Set Breakpoints & Trace Execution (`app.js`)

1. In **Chrome DevTools (`F12`)**, switch to the **Sources** panel.
2. In the left file tree, navigate to `localhost:8080 > todo-list > app.js`.
3. Click the line number inside your `add_todo` tool's `execute` callback function to set a **breakpoint**.
4. Open the **Application > WebMCP** panel in DevTools and manually trigger `add_todo` with test parameters (`{"text": "Debug breakpoint check"}`).
5. When script execution pauses on your breakpoint in the **Sources** panel, step over lines (`F10`) to inspect local variables and verify payload mapping.
6. Resume execution (`F8`) and verify the output payload in the **Tool Activity Log**.

---

## Task 4: Lighthouse Agentic Readiness Audit

To ensure your web application is accessible to both human users and autonomous AI agents, Chrome has introduced the experimental **Agentic Web Audit** in Lighthouse.

### 4.1. Run the Agentic Readiness Audit

1. In Chrome, open either your completed **Todo List App** or **French Bistro App**.
2. Open **Chrome DevTools (`F12`)** and select the **Lighthouse** tab.
3. Under **Mode**, select **Navigation (Default)**.
4. Under **Device**, select **Desktop**.
5. Under **Categories**, uncheck Performance/SEO if desired, but ensure **Accessibility** and **Agentic Web (Experimental)** are checked.
6. Click **Analyze page load**.

### 📊 4.2. Interpreting Your Audit Results

When the report completes, review the **Agentic Web** diagnostics:
* **✅ WebMCP Tools Registered:** Confirms that `navigator.modelContext` detected valid tool definitions without runtime errors.
* **✅ Schema Validation:** Verifies that all `inputSchema` definitions conform to valid JSON Schema draft-07 standards.
* **✅ Form & Input Accessible Labels:** Confirms that interactive buttons and inputs can be queried accurately by agent DOM parsers.
* **✅ Non-Destructive Auto-Submit Check:** Flags any declarative forms that use `toolautosubmit` on sensitive inputs (such as passwords, payment cards, or deletion triggers).

---

## Optional: IDE / CLI Tools Setup

Continue exploring WebMCP in your projects using Antigravity and Modern Web Guidance:

* **Antigravity IDE or CLI:** Install [Antigravity IDE](https://antigravity.google/product/antigravity-ide) or [Antigravity CLI](https://antigravity.google/product/antigravity-cli).
* **Modern Web Guidance Skill:** Verify that the [Modern Web Guidance](https://github.com/GoogleChrome/modern-web-guidance#-quickstart) skill is installed and accessible.
* **Gemini API Key:** Ensure your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/api-keys) is exported in your terminal environment (`echo $GEMINI_API_KEY`).

## 🎓 Conclusion & Additional Resources

* **Why Evals Matter:** Standard unit tests are insufficient for testing AI agent workflows because agents can select non-deterministic paths to complete tasks. **Evaluations (Evals)** test agent behaviors across diverse prompts to ensure consistent, reliable, and safe outcomes across all user queries.

### Recommended Reading & Tools
* **[WebMCP Documentation](https://developer.chrome.com/docs/ai/webmcp)** — Chrome developer guide, technical specifications, and browser flag references.
* **[GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools)** — Demo applications, browser extensions, and the experimental **Evals CLI**.
* **[Lighthouse GitHub Repository](https://github.com/GoogleChrome/lighthouse)** — Source repository for Lighthouse and experimental audit definitions.