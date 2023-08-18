var VuetiSelect = Vue.component("VuetiSelect", {
  template: `
  <div id="VuetiSelect" class="vuetiSelectBox">
    <div class="dropdownContainer">
      <div class="buttonBox">
        <button type="button" :class="cssBtnBox.customBtn" @click="toggleDropdown()">
          <span>{{ selectedOptionsText }}</span>
          <i :class="cssBtnBox.icon"></i>
        </button>
      </div>
      <transition name="fade">
        <div v-if="showDropdownMenu" :class="cssDropdownMenu">
          <div class="searchBox">
            <div class="svgSearchBox">
              <i class="svgSearch"></i>
            </div>
            <input type="text" v-model="searchTerm" placeholder="Search" class="searchBar" />
            <button class="clearButton" type="button" @click="clearSearch">
              <i class="svgEraser"></i>
            </button>
          </div>
          <div :class="cssUlBox">
            <div class="boxSelectAll">
              <label class="labelSelectAll">
                <input type="checkbox" v-model="selectAll" id="no-margin" class="inputSelectAll" />
                {{ selectAllTitle }}
              </label>
            </div>
            <ul class="ulMenu">
              <li v-for="element in filteredOptions" class="groupItem">
                <div class="groupBox">
                  <input type="checkbox" id="no-margin" class="groupCheckbox" v-model="element.selectAllObjects" @change="toggleSelectAllObjects(element)" :value="element.name" />
                  <label class="groupLabel">
                  <span v-html="element.name"></span>
                  <button type="button" @click="toggleGroup(element)" class="checkboxButton" v-show="element.subItems.length > 0">
                    <i :class="element.cssCheckbox"></i>
                  </button>
                  </label>
                </div>
                <transition name="fade">
                  <ul v-show="element.expanded" class="groupObjects">
                    <li v-for="item in element.subItems" :key="item">
                      <label class="">
                        <input type="checkbox" v-model="selectedOptions" :value="item" />
                        {{ item }}
                      </label>
                    </li>
                  </ul>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
  `,
  props: {
    value: Array,
    noOptionTitle: String,
    selectAllTitle: String,
    labelLimit: Number,
  },
  data() {
    return {
      elements: this.value.map(element => ({
        ...element,
        selectAllObjects: false,
      })),
      selectedOptions: [],
      searchTerm: "",
      showDropdownMenu: false,
      cssBtnBox: {
        customBtn: "close-btnVueti",
        icon: "svgCaretDown closed",
      },
      cssUlBox: "",
      cssDropdownMenu: "dropdownMenu",
      isMouseOver: false,
      selectAll: false,
    };
  },
  computed: {
    filteredOptions() {
      return this.elements.filter(
        (element) =>
          element.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          element.subItems.some((item) =>
            item.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
      );
    },    
    selectedOptionsText() {
      if (this.selectedOptions.length === 0) {
        return this.noOptionTitle;
      } else if (this.selectedOptions.length <= this.labelLimit) {
        return this.selectedOptions.join(", ");
      } else {
        const selectedCount = this.selectedOptions.length - this.labelLimit;
        const selectedNames = this.selectedOptions
          .slice(0, this.labelLimit)
          .join(", ");
        return `${selectedNames} (+${selectedCount})`;
      }
    },
  },
  watch: {
    selectAll(newValue) {
      if (newValue) {
        this.selectedOptions = this.filteredOptions.flatMap(element => element.subItems);
      } else {
        this.selectedOptions = [];
      }
    },
  },
  methods: {

    toggleSelectAllObjects(element) {
      if (element.selectAllObjects) {
        this.selectedOptions = [...this.selectedOptions, ...element.subItems];
      } else {
        this.selectedOptions = this.selectedOptions.filter((option) =>
          option !== element.name && !element.subItems.includes(option)
        );
      }
    },

    toggleDropdown() {
      this.showDropdownMenu = !this.showDropdownMenu;
      if (this.showDropdownMenu) {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "open-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown open";
        this.cssUlBox = "ulBox";
        document.addEventListener("click", this.handleOutsideClick);
      } else {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "close-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown closed";
        this.cssUlBox = "";
        this.searchTerm = "";
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },

    clearSearch() {
      this.searchTerm = "";
    },

    toggleGroup(element) {
      element.expanded = !element.expanded;
      if (element.expanded) {
        element.cssCheckbox = "svgArrow open";
      } else {
        element.cssCheckbox = "svgArrow";
      }
    },

    handleOutsideClick(event) {
      if (this.showDropdownMenu && !this.$el.contains(event.target)) {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "close-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown closed";
        this.cssUlBox = "";
        this.searchTerm = "";
        this.showDropdownMenu = false;
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
});
