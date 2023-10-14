var VuetiSelect = Vue.component("VuetiSelect", {
  template: `
    <div id="VuetiSelect" class="vuetiSelectBox">
      <div class="dropdownContainer">
        <div class="buttonBox">
          <button type="button" :class="cssBtnBox.customBtn" @click="toggleDropdown()">
            <span>{{ items.length > 0 ? selectedOptionsText : notFoundText }}</span>
            <i :class="items.length > 0 ? cssBtnBox.icon : ''"></i>
          </button>
        </div>
        <transition name="fade">
          <div v-if="showDropdownMenu && items.length > 0" :class="cssDropdownMenu">
            <div class="searchBox">
              <div class="svgSearchBox">
                <i class="svgSearch"></i>
              </div>
              <input type="text" v-model="searchTerm" :placeholder="searchText" class="searchBar" />
              <button class="btnClear" type="button" @click="clearSearch">
                <i class="svgEraser"></i>
              </button>
            </div>
            <div :class="cssItemsBox">
              <div class="boxSelectAll">
                <label class="labelSelectAll">
                  <input type="checkbox" id="noMargin" class="inputSelectAll" @change="toggleSelectAll"
                    v-model="selectedAll" />
                  <span class="selectAllText">{{ selectAllText }}</span>
                </label>
                <label class="valueCountText">{{ totalItemsText }} {{ totalItemsCount() }}</label>
              </div>
              <ul class="itemsMenu">
                <li v-for="item in filteredItems" :key="item.id" class="itemGroup">
                  <div class="itemBox">
                    <label class="itemLabel">
                      <input type="checkbox" id="noMargin" class="groupCheckbox" v-model="item.itemSelected"
                        @change="toggleItemSelect(item)" :items="item.id" />
                      <span class="displayNames" v-html="item.displayName"></span>
                      <button type="button" @click="toggleGroup(item)" class="toggleGroup"
                        v-if="item.subItems && item.subItems.length > 0">
                        <i :class="item.expanded ? 'svgArrow open': 'svgArrow'"></i>
                      </button>
                    </label>
                  </div>
                  <transition name="fade">
                    <ul v-if="item.expanded" class="subItemsMenu">
                      <li v-for="subItem in item.subItems" :key="subItem.id">
                        <div class="subItemBox">
                          <label class="subItemLabel">
                            <input type="checkbox" id="noMargin" v-model="subItem.subItemSelected" :items="subItem.id"
                              @change="toggleSingleSubItem(item)" />
                            <span class="displayNames" v-html="subItem.displayName"></span>
                          </label>
                        </div>
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
    items: {
      type: Array,
      default: [],
    },
    totalItemsText: {
      type: String,
      default: "Total:",
    },
    notFoundText: {
      type: String,
      default: "No data found.",
    },
    noSelectedText: {
      type: String,
      default: "All items",
    },
    selectAllText: {
      type: String,
      default: "Select all",
    },
    searchText: {
      type: String,
      default: "Search...",
    },
    labelLimit: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      selectedOptions: [],
      searchTerm: "",
      showDropdownMenu: false,
      cssBtnBox: {
        customBtn: "close-btnVueti",
        icon: "svgCaretDown closed",
      },
      cssItemsBox: "",
      cssDropdownMenu: "dropdownMenu",
      isMouseOver: false,
      selectedAll: false,
    };
  },
  computed: {
    filteredItems() {
      if (this.searchTerm === "") {
        return this.items;
      }
      const normalizedSearchTerm = this.normalizeText(this.searchTerm);
      const matchingItems = this.items.filter((item) => {
        const normalizedItemName = this.normalizeText(item.name);
        const itemNameMatches =
          normalizedItemName.includes(normalizedSearchTerm);

        if (item.subItems && item.subItems.length > 0) {
          const matchingSubItems = item.subItems.filter((subItem) => {
            const normalizedSubItemName = this.normalizeText(subItem.name);
            return normalizedSubItemName.startsWith(normalizedSearchTerm);
          });
          if (itemNameMatches || matchingSubItems.length > 0) {
            item.expanded = true;
          }
          return itemNameMatches || matchingSubItems.length > 0;
        } else {
          return itemNameMatches;
        }
      });

      return matchingItems;
    },
    allSelected() {
      const explicitSelection = this.selectedAll;
      const automaticSelection = this.items.every((item) => {
        const itemSelected = item.itemSelected;
        const subItemsSelected =
          !item.subItems ||
          item.subItems.every((subItem) => subItem.subItemSelected);
        return itemSelected && subItemsSelected;
      });

      return explicitSelection || automaticSelection;
    },
    selectedOptionsText() {
      if (this.selectedOptions.length === 0) {
        return this.noSelectedText;
      } else if (this.selectedOptions.length <= this.labelLimit) {
        return this.selectedOptions.map((item) => item.name).join(", ");
      } else {
        const selectedCount = this.selectedOptions.length - this.labelLimit;
        const selectedNames = this.selectedOptions
          .slice(0, this.labelLimit)
          .map((item) => item.name)
          .join(", ");

        return `${selectedNames} (+${selectedCount})`;
      }
    },
  },
  watch: {
    items: {
      handler() {
        const selectAll = this.items.every((item) => {
          const itemSelected = item.itemSelected;
          const subItemsSelected =
            !item.subItems ||
            item.subItems.every((subItem) => subItem.subItemSelected);

          return itemSelected && subItemsSelected;
        });
        this.selectedAll = selectAll;
      },
      deep: true,
    },
  },
  methods: {
    getSelectedOptionsIds() {
      const selectedOptions = [];
      this.items.forEach((item) => {
        if (item.subItems && item.subItems.length > 0) {
          const selectedSubItemsInGroup = item.subItems.filter(
            (subItem) => subItem.subItemSelected
          );
          if (selectedSubItemsInGroup.length > 0) {
            const subItemIds = selectedSubItemsInGroup.map(
              (subItem) => subItem.id
            );
            selectedOptions.push(...subItemIds);
          }
        } else if (item.itemSelected) {
          selectedOptions.push(item.id);
        }
      });

      return selectedOptions;
    },
    toggleSelectAll() {
      if (this.selectedAll) {
        this.items.forEach((item) => {
          item.itemSelected = true;
          if (item.subItems) {
            item.subItems.forEach((subItem) => {
              subItem.subItemSelected = true;
            });
          }
        });
      } else {
        this.items.forEach((item) => {
          item.itemSelected = false;
          if (item.subItems) {
            item.subItems.forEach((subItem) => {
              subItem.subItemSelected = false;
            });
          }
        });
      }
      this.updateSelectedOptions();
    },
    toggleSingleSubItem(item) {
      item.itemSelected = item.subItems.every(
        (subItem) => subItem.subItemSelected
      );
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
        item.subItems.forEach((subItem) => {
          subItem.subItemSelected = item.itemSelected;
        });
      }
      this.updateSelectedOptions();
    },
    toggleGroup(item) {
      if (typeof item.expanded === 'undefined') {
        item.expanded = false;
      }
      item.expanded = !item.expanded;
      if (item.expanded) {
        item.cssCheckbox = "svgArrow open";
      } else {
        item.cssCheckbox = "svgArrow";
      }
    },
    removeSelectedItem(item) {
      const index = this.selectedOptions.findIndex(
        (selectedItem) => selectedItem.id === item.id
      );
      if (index !== -1) {
        this.selectedOptions.splice(index, 1);
      }
    },
    updateSelectedOptions() {
      this.selectedOptions = this.items.flatMap((item) => {
        if (!item.subItems || item.subItems.length === 0) {
          return item.itemSelected ? [item] : [];
        } else {
          return item.subItems.filter((subItem) => subItem.subItemSelected);
        }
      });
    },
    getTotalItems(item) {
      if (item.subItems && item.subItems.length > 0) {        
        return item.subItems.length;
      } else {       
        return 1;
      }
    },
    totalItemsCount() {
      let totalCount = 0;
      for (const item of this.filteredItems) {
        totalCount += this.getTotalItems(item);
      }
      return totalCount;
    },
    clearSearch() {
      this.searchTerm = "";
    },
    normalizeText(text) {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    },
    toggleDropdown() {
      this.showDropdownMenu = !this.showDropdownMenu;
      if (this.showDropdownMenu) {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "open-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown open";
        this.cssItemsBox = "itemsBox";
        document.addEventListener("click", this.handleOutsideClick);
      } else {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "close-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown closed";
        this.cssItemsBox = "";
        this.searchTerm = "";
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },
    handleOutsideClick(event) {
      if (this.showDropdownMenu && !this.$el.contains(event.target)) {
        this.cssDropdownMenu = "dropdownMenu";
        this.cssBtnBox.customBtn = "close-btnVueti";
        this.cssBtnBox.icon = "svgCaretDown closed";
        this.cssItemsBox = "";
        this.searchTerm = "";
        this.showDropdownMenu = false;
        document.removeEventListener("click", this.handleOutsideClick);
      }
    },
  },
});
