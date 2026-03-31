import { Mark } from "@tiptap/core";

export const ImportantMark = Mark.create({
  name: "important",

  parseHTML() {
    return [
      {
        tag: "mark[data-important]",
      },
      {
        tag: "span[data-important]",
      },
    ];
  },

  renderHTML() {
    return ["mark", { "data-important": "true" }, 0];
  },
});
