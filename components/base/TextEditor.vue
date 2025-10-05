<script setup>
import { useField } from "vee-validate";
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { ref, watch, computed } from 'vue';

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    required: true
  },
  id: String,
  placeholder: String,
  label: String,
  labelClass: {
    type: String,
    default: ""
  },
  rules: {
    type: String,
    default: ""
  },
  showToolbar: {
    type: Boolean,
    default: true
  },
  minHeight: {
    type: String,
    default: "200px"
  },
  maxHeight: {
    type: String,
    default: "400px"
  },
  readOnly: {
    type: Boolean,
    default: false
  }
});

const { errorMessage, value: inputValue } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary-light dark:text-primary-dark underline'
      }
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded'
      }
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    Underline
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none'
    }
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    emit("update:modelValue", html);
    inputValue.value = html;
  }
});

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue !== editor.value.getHTML()) {
    editor.value.commands.setContent(newValue || '');
  }
});

// Watch for readOnly changes
watch(() => props.readOnly, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(!newValue);
  }
});

const isActive = (name) => {
  return editor.value?.isActive(name);
};

const toggleBold = () => editor.value?.chain().focus().toggleBold().run();
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run();
const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run();
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run();
const toggleCode = () => editor.value?.chain().focus().toggleCode().run();
const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run();
const toggleBulletList = () => editor.value?.chain().focus().toggleBulletList().run();
const toggleOrderedList = () => editor.value?.chain().focus().toggleOrderedList().run();
const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run();
const setParagraph = () => editor.value?.chain().focus().setParagraph().run();
const toggleHeading = (level) => editor.value?.chain().focus().toggleHeading({ level }).run();
const setTextAlign = (align) => editor.value?.chain().focus().setTextAlign(align).run();
const undo = () => editor.value?.chain().focus().undo().run();
const redo = () => editor.value?.chain().focus().redo().run();
</script>

<template>
  <div>
    <!-- Label -->
    <div class="mb-2 flex gap-2">
      <slot name="label" />
      <label v-if="props.label" :for="props.id || ''" :class="[
        props.labelClass,
        'text-textPrimary-light dark:text-textPrimary-dark text-sm font-medium',
      ]">
        {{ props.label }}
        <span v-if="
          typeof rules === 'object'
            ? Object.hasOwn(rules, 'required')
            : rules.includes('required')
        " class="text-red-600 dark:text-red-400">*</span>
      </label>
    </div>

    <!-- Editor Container -->
    <div :class="[
      errorMessage
        ? 'border-red-500 dark:border-red-400'
        : 'border border-borderColor-light dark:border-borderColor-dark focus-within:border-primary-light dark:focus-within:border-primary-dark',
    ]" class="rounded-md bg-card-light dark:bg-card-dark transition-colors">
      <!-- Toolbar -->
      <div v-if="showToolbar && !readOnly"
        class="border-b border-borderColor-light dark:border-borderColor-dark p-2 flex flex-wrap gap-1">
        <!-- Text Formatting -->
        <div class="flex items-center gap-1 border-r border-borderColor-light dark:border-borderColor-dark pr-2 mr-2">
          <button type="button" @click="toggleBold"
            :class="isActive('bold') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Bold">
            <Icon name="mdi:format-bold" class="w-4 h-4" />
          </button>
          <button type="button" @click="toggleItalic"
            :class="isActive('italic') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Italic">
            <Icon name="mdi:format-italic" class="w-4 h-4" />
          </button>
          <button type="button" @click="toggleUnderline"
            :class="isActive('underline') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Underline">
            <Icon name="mdi:format-underline" class="w-4 h-4" />
          </button>
          <button type="button" @click="toggleStrike"
            :class="isActive('strike') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Strikethrough">
            <Icon name="mdi:format-strikethrough" class="w-4 h-4" />
          </button>
        </div>

        <!-- Headings -->
        <div class="flex items-center gap-1 border-r border-borderColor-light dark:border-borderColor-dark pr-2 mr-2">
          <button type="button" @click="setParagraph"
            :class="isActive('paragraph') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Paragraph">
            <Icon name="mdi:format-paragraph" class="w-4 h-4" />
          </button>
          <button type="button" @click="toggleHeading(1)"
            :class="isActive('heading', { level: 1 }) ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Heading 1">
            <Icon name="mdi:format-header-1" class="w-4 h-4" />
          </button>
          <button type="button" @click="toggleHeading(2)"
            :class="isActive('heading', { level: 2 }) ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Heading 2">
            <Icon name="mdi:format-header-2" class="w-4 h-4" />
          </button>
          <button type="button" @click="toggleHeading(3)"
            :class="isActive('heading', { level: 3 }) ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Heading 3">
            <Icon name="mdi:format-header-3" class="w-4 h-4" />
          </button>
        </div>

        <!-- Lists -->
        <div class="flex items-center gap-1 border-r border-borderColor-light dark:border-borderColor-dark pr-2 mr-2">
          <button type="button" @click="toggleBulletList"
            :class="isActive('bulletList') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Bullet List">
            <Icon name="mdi:format-list-bulleted" class="w-4 h-4" />
          </button>
          <button type="button" @click="toggleOrderedList"
            :class="isActive('orderedList') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Numbered List">
            <Icon name="mdi:format-list-numbered" class="w-4 h-4" />
          </button>
          <button type="button" @click="toggleBlockquote"
            :class="isActive('blockquote') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Quote">
            <Icon name="mdi:format-quote-open" class="w-4 h-4" />

          </button>
        </div>

        <!-- Alignment -->
        <div class="flex items-center gap-1 border-r border-borderColor-light dark:border-borderColor-dark pr-2 mr-2">
          <button type="button" @click="setTextAlign('left')"
            :class="isActive({ textAlign: 'left' }) ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Align Left">
            <Icon name="mdi:format-align-left" class="w-4 h-4" />
          </button>
          <button type="button" @click="setTextAlign('center')"
            :class="isActive({ textAlign: 'center' }) ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Align Center">
            <Icon name="mdi:format-align-center" class="w-4 h-4" />
          </button>
          <button type="button" @click="setTextAlign('right')"
            :class="isActive({ textAlign: 'right' }) ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Align Right">
            <Icon name="mdi:format-align-right" class="w-4 h-4" />
          </button>
        </div>

        <!-- Code -->
        <div class="flex items-center gap-1 border-r border-borderColor-light dark:border-borderColor-dark pr-2 mr-2">
          <button type="button" @click="toggleCode"
            :class="isActive('code') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Inline Code">
            <Icon name="mdi:code-tags" class="w-4 h-4" />
          </button>
          <button type="button" @click="toggleCodeBlock"
            :class="isActive('codeBlock') ? 'bg-primary-light dark:bg-primary-dark text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
            class="p-1.5 rounded text-sm transition-colors" title="Code Block">
            <Icon name="mdi:code-braces" class="w-4 h-4" />
          </button>
        </div>

        <!-- History -->
        <div class="flex items-center gap-1">
          <button type="button" @click="undo" :disabled="!editor?.can().undo()"
            class="p-1.5 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Undo">
            <Icon name="mdi:undo" class="w-4 h-4" />
          </button>
          <button type="button" @click="redo" :disabled="!editor?.can().redo()"
            class="p-1.5 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Redo">
            <Icon name="mdi:redo" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Editor Content -->
      <div class="p-3" :style="{
        minHeight: minHeight,
        maxHeight: maxHeight,
        overflowY: 'auto'
      }">
        <EditorContent :editor="editor" :class="[
          'text-textPrimary-light dark:text-textPrimary-dark',
          readOnly ? 'cursor-default' : 'cursor-text'
        ]" />
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="errorMessage" :class="errorMessage ? 'h-5' : 'h-0'" class="mt-2 text-sm text-red-600 dark:text-red-400">
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>

<style>
/* TipTap Editor Styles */
.ProseMirror {
  outline: none;
  min-height: 100px;
}

.ProseMirror p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.ProseMirror h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
}

.ProseMirror h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
}

.ProseMirror h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
}

.ProseMirror blockquote {
  border-left: 3px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
}

.ProseMirror code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.ProseMirror pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.ProseMirror pre code {
  background-color: transparent;
  padding: 0;
}

.ProseMirror ul,
.ProseMirror ol {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.ProseMirror li {
  margin: 0.25rem 0;
}

/* Dark mode styles */
.dark .ProseMirror blockquote {
  border-left-color: #4b5563;
}

.dark .ProseMirror code {
  background-color: #374151;
}

.dark .ProseMirror pre {
  background-color: #374151;
}
</style>