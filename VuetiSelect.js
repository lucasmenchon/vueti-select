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
            <li v-for="item in filteredOptions" class="groupItem">
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
                  <li v-for="subItem in item.subItems" :key="subItem">
                    <input type="checkbox" v-model="subItem.selected" :value="subItem.id"
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
          selected: false,
        })),
        itemSelected: false,
        expanded: false,
        cssCheckbox: "svgArrow",
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
      return this.items.filter(
        (item) =>
          item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.subItems.some((subItem) =>
            subItem.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
      );
    },
    selectedOptionsText() {
      if (this.selectedOptions.length === 0) {
        return this.noOptionTitle;
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
    selectAll(value) {
      if (value) {
        const allSelected = this.items.every((item) =>
          item.subItems.every((subItem) => subItem.selected)
        );
        if (allSelected) {
          this.items.forEach((item) => {
            item.itemSelected = true;
            item.subItems.forEach((subItem) => {
              subItem.selected = true;
            });
          });
          this.selectedOptions = this.items.flatMap((item) => item.subItems);
        }
      } else {
        this.selectedOptions = [];
        this.items.forEach((item) => {
          item.itemSelected = false;
          item.subItems.forEach((subItem) => {
            subItem.selected = false;
          });
        });
      }
    },
  },
  methods: {
    toggleSingleSubItem(item) {
      item.itemSelected = item.subItems.every((subItem) => subItem.selected);
      this.selectAll = this.items.every((item) =>
        item.subItems.every((subItem) => subItem.selected)
      );
      this.updateSelectedOptions();
    },
    toggleSingleItem(item) {
      if (item.itemSelected) {
        this.selectedOptions.push(item);
      } else {
        const index = this.selectedOptions.findIndex(
          (selectedItem) => selectedItem.id === item.id
        );
        if (index !== -1) {
          this.selectedOptions.splice(index, 1);
        }
      }
    },
    toggleItemSelect(item) {
      if (item.subItems && item.subItems.length > 0) {
        this.selectAllSubItems(item);
        this.updateSelectedOptions();
      } else {
        this.toggleSingleItem(item);
      }
    },
    selectAllSubItems(item) {
      if (item.subItems.length > 0) {
        item.subItems.forEach((subItem) => {
          subItem.selected = item.itemSelected;
        });
      }
    },
    updateSelectedOptions() {
      this.selectedOptions = this.items
        .flatMap((item) => item.subItems)
        .filter((subItem) => subItem.selected);
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
    toggleGroup(item) {
      item.expanded = !item.expanded;
      if (item.expanded) {
        item.cssCheckbox = "svgArrow open";
      } else {
        item.cssCheckbox = "svgArrow";
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
