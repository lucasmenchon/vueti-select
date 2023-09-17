<h1 style="text-align: center;">Vueti Select (Multiple Select Component)</h1>

<p style="text-align: center;">Enhance your Vue.js application with the powerful VuetiSelect, a versatile multiple select component. This component offers advanced features for selecting multiple items.</p>

<h2 style="text-align: center;">Features</h2>

<ul>
  <li><strong>Search:</strong> Easily search and find items from a lengthy list.</li>
  <li><strong>Clear Search:</strong> Clear the search input at any time.</li>
  <li><strong>Multi Selection:</strong> Effortlessly select multiple items.</li>
  <li><strong>Grouping:</strong> Organize items into logical groups.</li>
</ul>

<h2 style="text-align: center;">Usage</h2>

<p>o use the Vueti Select component in your Vue templates, you can pass various props to customize its behavior</p>

<ul>
<li><code>value</code> (Array): An array representing the options to be selected.</li>
<li><code>no-option-title</code> (String): Text to display when no option is selected.</li>
<li><code>select-all-title</code> (String): Text for the "Button to select all".</li>
<li><code>label-limit</code> (Number): Limit the number of selected labels displayed.</li>
</ul>

<code>
&lt;VuetiSelect
:value="itemsToBeSelected"
:no-option-title="'No Option Selected'"
:select-all-title="'Select All'"
:label-limit="3"
&gt;&lt;/VuetiSelect&gt;
</code>

<img src="/imgs/componentImg.png" alt="Vueti Select Image 1" style="display: block; margin: 0 auto;">

<h2 style="text-align: center;">Contributing</h2>

<p>Contributions are welcome! Feel free to open issues and pull requests.</p>
