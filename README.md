<h2 style="text-align: center;">Vueti Select (Multiple Select Component)</h2>

<p style="text-align: center;">Enhance your Vue.js application with the powerful VuetiSelect, a versatile multiple select component. This component offers advanced features for selecting multiple items.</p>

<h2 style="text-align: center;">Features </h2>

<ul>
  <li><strong>Search: </strong>Easily search and find items from a lengthy list.</li>
  <li><strong>Clear Search: </strong>Clear the search input at any time.</li>
  <li><strong>Multi Selection: </strong>Effortlessly select multiple items.</li>
  <li><strong>Grouping: </strong>Organize items into logical groups.</li>
</ul>

<h2 style="text-align: center;">Installation</h2>
<p>To use Vueti Select in your Vue.js project, follow these steps:</p>
<p>Import our .css file into your template, it is located in the assets folder and using vue.js 2.</p>
<p>Install the package</p>
<ol>
<li>Download the component, import it into your html:</li>
</ol>
<pre><code>&lt;script src="VuetiSelect.js">&lt;/script></code></pre>
<ol start="2">
<li>Via npm:</li>
</ol>
<pre><code>npm install vueti-select</code></pre>
<ol start="3">
<li>Import and register the component in your Vue app:</li>
</ol>
<pre><code>import VuetiSelect from 'vueti-select';
Vue.component('vueti-select', VuetiSelect);</code></pre>
<pre><code>var app = new Vue({
      el: "#app",
      components: {
        'vueti-select': VuetiSelect,       
      },
});</code></pre>

<ol start="4">
<li>Now you can use the <code>VuetiSelect</code> component in your Vue templates.</li>
</ol>

<h2 style="text-align: center;">Usage</h2>

<p>To use the Vueti Select component in your Vue models, you can pass various accessories to customize its behavior, see example in html.</p>
<p>All props, except items, already have a default value and are not required, but prop items are required.</p>

<pre><code>&lt;vueti-select ref="VuetiSelect" :items="itemsToBeSelected"&gt;&lt;/vueti-select&gt;</code></pre>

<ul>
<li><code>items</code> (Array - required): An array representing the options to be selected. <code>Default value: []</code></li>
<li><code>total-items-text</code> (String - not required): Text to display the total data listed. <code>Default value: 'Total:'</code></li>
<li><code>not-found-text</code> (String - not required): Text to display when there is no data found. <code>Default value: 'No data found.'</code></li>
<li><code>no-selected-text</code> (String - not required): Text to display when nothing is selected. <code>Default value: 'All items'</code></li>
<li><code>select-all-text</code> (String - not required): Text to display on the select all button. <code>Default value: 'Select all'</code></li>
<li><code>search-text</code> (String - not required): Text to display in the search bar. <code>Default value: 'Search...'</code></li>
<li><code>label-limit</code> (Number - not required): Limit the number of selected labels displayed. <code>Default value: 1</code></li>
</ul>

<p>You need to pass an array of "items" which are the objects that will be selected,
these objects can have an array of "subItems",
subItems are the "children" of an item.</p>
<p>note: An item is only selected when it has no "subItems".</p>

<p>Each item must have the following properties:</p>

<ul>
  <li><strong>id: </strong>Unique identifier for your object.</li>
  <li><strong>name: </strong>The name of your object to appear in the label when it is selected.</li>
  <li><strong>displayName: </strong>The name of your object to appear in the selection menu, it can be customized with html.</li>
  <li><strong>expanded: </strong>Bool property of the item to expand it if it has subItems, when there are subItems it shows the cursor icon to expand. (required only if it has subItems)</li>
  <li><strong>subItems: </strong>Array with the list of children if the parent object "item" has.</li>
</ul>

<p>Each subItem must have the following properties:</p>

<ul>
  <li><strong>id: </strong>Unique identifier for your object.</li>
  <li><strong>name: </strong>The name of your object to appear in the label when it is selected.</li>
  <li><strong>displayName: </strong>The name of your object to appear in the selection menu, it can be customized with html.</li>
</ul>

<p>Example:</p>

<pre><code>items: [
          {
            id: 1,
            name: "Clothing",
            displayName: "&lt;div style='color:gray;'>Clothing with html&lt;/div>",
          },
          {
            id: 2,
            name: "tést",
            displayName: "tést",
          },
          {
            id: 3,
            name: "Food",
            displayName: "Food html",
            expanded: false,
            subItems: [
              {
                id: 11,
                name: "Fruits",
                displayName: "&lt;div style='color:green;'>Fruits&lt;/div>",                
              },
              {
                id: 12,
                name: "Vegetables",
                displayName: "&lt;div style='color:red;'>Vegetables&lt;/div>",                
              },
              {
                id: 13,
                name: "Meat",
                displayName: "&lt;div style='color:blue;'>Meat&lt;/div>",
              },
            ]
          },
          {
            id: 4,
            name: "Electronics",
            displayName: "Electronics",
          },
        ],</code></pre>

<img src="https://github.com/lucasmenchon/vueti-select/blob/vueti-deploy/imgs/componentImg.png" alt="Vueti Select Image 1" style="display: block; margin: 0 auto;">

<h2 style="text-align: center;">Get Selected Options</h2>

<p>To get the selected items or subitems, simply call the getSelectedOptions method of your component instance from your Vue application instance using $refs and pass your list of items as a parameter, for example:</p>

<pre><code>vueInstance.$refs.VuetiSelect.getSelectedOptions(vueInstance.items)</code></pre>

<p>note: Only the "ID" of each object is returned in the getSelectedOptions method.</p>

<h2 style="text-align: center;">Contributing</h2>

<p>Contributions are welcome! Feel free to open issues and pull requests.</p>
