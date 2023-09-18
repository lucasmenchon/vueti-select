<h2 style="text-align: center;">Vueti Select (Multiple Select Component)</h2>

<p style="text-align: center;">Enhance your Vue.js application with the powerful VuetiSelect, a versatile multiple select component. This component offers advanced features for selecting multiple items.</p>

<h2 style="text-align: center;">Features</h2>

<ul>
  <li><strong>Search:</strong> Easily search and find items from a lengthy list.</li>
  <li><strong>Clear Search:</strong> Clear the search input at any time.</li>
  <li><strong>Multi Selection:</strong> Effortlessly select multiple items.</li>
  <li><strong>Grouping:</strong> Organize items into logical groups.</li>
</ul>

<h2 style="text-align: center;">Installation</h2>
<p>To use Vueti Select in your Vue.js project, follow these steps:</p>
<ol>
<li>Install the package via npm:</li>
</ol>
<pre>
<code>npm install vueti-select</code>
</pre>
<ol start="2">
<li>Import and register the component in your Vue app:</li>
</ol>
<pre>
<code>
import Vue from 'vue';
import VuetiSelect from 'vueti-select';
Vue.component('VuetiSelect', VuetiSelect);
</code>
</pre>

<ol start="3">
<li>Now you can use the <code>VuetiSelect</code> component in your Vue templates.</li>
</ol>

<h2 style="text-align: center;">Usage</h2>

<p>To use the Vueti Select component in your Vue models, you can pass various accessories to customize its behavior, see example in html.</p>

<pre><code>&lt;vueti-select
:value="itemsToBeSelected"
:no-option-title="'No Option Selected'"
:select-all-title="'Select All'"
:label-limit="3"&gt;
&lt;/vueti-select&gt;</code></pre>

<ul>
<li><code>value</code> (Array): An array representing the options to be selected.</li>
<li><code>no-option-title</code> (String): Text to display when no option is selected.</li>
<li><code>select-all-title</code> (String): Text for the "Button to select all".</li>
<li><code>label-limit</code> (Number): Limit the number of selected labels displayed.</li>
</ul>

<img src="https://github.com/lucasmenchon/vueti-select/blob/vueti-deploy/imgs/componentImg.png" alt="Vueti Select Image 1" style="display: block; margin: 0 auto;">

<h2 style="text-align: center;">Contributing</h2>

<p>Contributions are welcome! Feel free to open issues and pull requests.</p>