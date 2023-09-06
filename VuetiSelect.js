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
              <input type="checkbox" id="no-margin" class="inputSelectAll" @change="toggleSelectAll"
                v-model="selectedAll" />
              {{ selectAllTitle }}
            </label>
          </div>
          <ul class="ulMenu">          
            <li v-for="item in filteredItems" :key="item.id" class="groupItem">
              <div class="groupBox">
                <input type="checkbox" id="no-margin" class="groupCheckbox" v-model="item.itemSelected"
                  @change="toggleItemSelect(item)" :value="item.id" />
                <label class="groupLabel">
                  <span v-html="item.displayName"></span>
                  <button type="button" @click="toggleGroup(item)" class="checkboxButton"
                    v-show="item.subItems.length > 0">
                    <i :class="item.cssCheckbox"></i>
                  </button>
                </label>
              </div>
              <transition name="fade">
                <ul v-show="item.expanded" class="groupObjects">
                  <li v-for="subItem in item.subItems" :key="subItem.id">
                    <input type="checkbox" v-model="subItem.subItemSelected" :value="subItem.id"
                      @change="toggleSingleSubItem(item)" />
                    <label>
                      <span v-html="subItem.displayName"></span>
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
      items: this.value.map((item) => ({
        id: item.id,
        name: item.name,
        displayName: item.displayName,
        subItems: item.subItems.map((subItem) => ({
          id: subItem.id,
          name: subItem.name,
          displayName: subItem.displayName,
          subItemSelected: false,
        })),
        itemSelected: false,
        expanded: false,
        cssCheckbox: "svgArrow",
      })),
      filteredItems: [],
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
      selectedAll: false,
    };
  },
  computed: {
    allSelected() {
      const explicitSelection = this.selectedAll; // Estado explícito do checkbox selectedAll
      const automaticSelection = this.items.every(item => {
        const itemSelected = item.itemSelected;
        const subItemsSelected = !item.subItems || item.subItems.every(subItem => subItem.subItemSelected);
        return itemSelected && subItemsSelected;
      });
      return explicitSelection || automaticSelection;
    },

    selectedOptionsText() {
      if (this.selectedOptions.length === 0) {
        return this.noOptionTitle;
      } else if (this.selectedOptions.length <= this.labelLimit) {
        return this.selectedOptions.map(item => item.name).join(", ");
      } else {
        const selectedCount = this.selectedOptions.length - this.labelLimit;
        const selectedNames = this.selectedOptions.slice(0, this.labelLimit).map(item => item.name).join(", ");
        return `${selectedNames} (+${selectedCount})`;
      }
    },
  },
  watch: {
    items: {
      handler() {
        const selectAll = this.items.every(item => {
          const itemSelected = item.itemSelected;
          const subItemsSelected = !item.subItems || item.subItems.every(subItem => subItem.subItemSelected);
          return itemSelected && subItemsSelected;
        });
        this.selectedAll = selectAll;
      },
      deep: true,
    },
    searchTerm(newSearchTerm) {
      if (newSearchTerm !== '') {
        this.filteredItems = this.items.filter(item => {
          const itemNameMatches = item.name.toLowerCase().includes(newSearchTerm.toLowerCase());
          const matchingSubItems = item.subItems && item.subItems.filter(subItem =>
            subItem.name.toLowerCase().includes(newSearchTerm.toLowerCase())
          );
          return itemNameMatches || (matchingSubItems && matchingSubItems.length > 0);
        });
      } else {
        // Se o searchTerm estiver vazio, redefina os resultados filtrados
        this.filteredItems = this.items;
      }
    },
  },
  methods: {

    toggleSelectAll() {
      if (this.selectedAll) {
        this.items.forEach(item => {
          item.itemSelected = true;
          if (item.subItems) {
            item.subItems.forEach(subItem => {
              subItem.subItemSelected = true;
            });
          }
        });
      } else {
        this.items.forEach(item => {
          item.itemSelected = false;
          if (item.subItems) {
            item.subItems.forEach(subItem => {
              subItem.subItemSelected = false;
            });
          }
        });
      }
      this.updateSelectedOptions();
    },

    toggleSingleSubItem(item) {
      item.itemSelected = item.subItems.every(subItem => subItem.subItemSelected);
      this.updateSelectedOptions();
    },

    toggleSingleItem(item) {
      if (item.itemSelected) {
        this.selectedOptions.push(item);
      } else {
        this.removeSelectedItem(item);
      }
    },

    toggleItemSelect(item) {
      if (item.subItems && item.subItems.length > 0) {
        this.toggleSubItems(item);
      } else {
        this.toggleSingleItem(item);
      }
    },

    toggleSubItems(item) {
      if (item.subItems.length > 0) {
        item.subItems.forEach(subItem => {
          subItem.subItemSelected = item.itemSelected;
        });
      }
      this.updateSelectedOptions();
    },

    toggleGroup(item) {
      item.expanded = !item.expanded;
      if (item.expanded) {
        item.cssCheckbox = "svgArrow open";
      } else {
        item.cssCheckbox = "svgArrow";
      }
    },

    removeSelectedItem(item) {
      const index = this.selectedOptions.findIndex(selectedItem => selectedItem.id === item.id);
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      }
    },

    updateSelectedOptions() {
      this.selectedOptions = this.items.flatMap(item => {
        if (!item.subItems || item.subItems.length === 0) {
          return item.itemSelected ? [item] : [];
        } else {
          return item.subItems.filter(subItem => subItem.subItemSelected);
        }
      });
    },

    clearSearch() {
      this.searchTerm = "";
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
