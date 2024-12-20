<!-- components/CardItem.vue -->
<template>
    <div class="card-item" @click="$emit('click')">
        <div class="card-content">
            <h4 v-if="!isEditing" class="card-title">{{ card.title }}</h4>
            <input
                v-else
                v-model="editedTitle"
                ref="titleInput"
                class="title-input"
                @blur="saveTitle"
                @keyup.enter="saveTitle"
                @keyup.esc="cancelEditing"
                :disabled="!canEdit"
            />
            <p v-if="card.description" class="card-description">
                {{ truncatedDescription }}
            </p>
        </div>

        <div class="card-badges" v-if="showBadges">
            <div v-if="card.description" class="badge description-badge">
                <DocumentTextIcon class="badge-icon" />
            </div>
            <div v-if="card.attachments?.length" class="badge attachment-badge">
                <PaperclipIcon class="badge-icon" />
                {{ card.attachments.length }}
            </div>
            <div v-if="card.comments?.length" class="badge comment-badge">
                <MessageSquareIcon class="badge-icon" />
                {{ card.comments.length }}
            </div>
        </div>

        <div class="card-actions" v-if="canEdit">
            <button @click.stop="editCard" class="action-btn edit">
                <PencilIcon class="action-icon" />
            </button>
            <button @click.stop="deleteCard" class="action-btn delete">
                <TrashIcon class="action-icon" />
            </button>
        </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import {
    DocumentTextIcon,
    PaperclipIcon,
    MessageSquareIcon,
    PencilIcon,
    TrashIcon
} from 'lucide-vue-next';

export default {
    name: 'CardItem',

    components: {
        DocumentTextIcon,
        PaperclipIcon,
        MessageSquareIcon,
        PencilIcon,
        TrashIcon
    },

    props: {
        card: {
            type: Object,
            required: true
        },
        canEdit: {
            type: Boolean,
            default: false
        }
    },

    setup(props, { emit }) {
        const isEditing = ref(false);
        const editedTitle = ref(props.card.title);
        const titleInput = ref(null);

        const truncatedDescription = computed(() => {
            if (!props.card.description) return '';
            return props.card.description.length > 100
                ? props.card.description.substring(0, 97) + '...'
                : props.card.description;
        });

        const showBadges = computed(() => {
            return (
                props.card.description ||
                props.card.attachments?.length ||
                props.card.comments?.length
            );
        });

        const startEditing = () => {
            if (!props.canEdit) return;
            isEditing.value = true;
            editedTitle.value = props.card.title;
            setTimeout(() => {
                titleInput.value?.focus();
            });
        };

        const saveTitle = () => {
            if (!editedTitle.value.trim() || editedTitle.value === props.card.title) {
                return cancelEditing();
            }

            emit('update', {
                _id: props.card._id,
                ...props.card,
                title: editedTitle.value.trim()
            });
            cancelEditing();
        };

        const cancelEditing = () => {
            isEditing.value = false;
            editedTitle.value = props.card.title;
        };

        const editCard = () => {
            startEditing();
        };

        const deleteCard = () => {
            if (confirm('Are you sure you want to delete this card?')) {
                emit('delete', props.card._id);
            }
        };

        return {
            isEditing,
            editedTitle,
            titleInput,
            truncatedDescription,
            showBadges,
            editCard,
            deleteCard,
            saveTitle,
            cancelEditing,
            startEditing
        };
    }
};
</script>

<style scoped>
.card-item {
    background: white;
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    padding: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    position: relative;
}

.card-item:hover {
    background: #f8f9fa;
}

.card-content {
    margin-bottom: 4px;
}

.card-title {
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 500;
}

.card-description {
    margin: 0;
    font-size: 12px;
    color: #6b778c;
}

.card-badges {
    display: flex;
    gap: 8px;
    margin-top: 4px;
}

.badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #6b778c;
}

.badge-icon {
    width: 12px;
    height: 12px;
}

.card-actions {
    position: absolute;
    top: 4px;
    right: 4px;
    display: none;
    gap: 4px;
    background: rgba(255, 255, 255, 0.8);
    padding: 2px;
    border-radius: 3px;
}

.card-item:hover .card-actions {
    display: flex;
}

.action-btn {
    padding: 4px;
    background: none;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn:hover {
    background: rgba(9, 30, 66, 0.08);
}

.action-icon {
    width: 14px;
    height: 14px;
}

.action-btn.edit {
    color: #0079bf;
}

.action-btn.delete {
    color: #dc3545;
}

.action-btn.delete:hover {
    background: #ffe3e3;
}

/* Badge colors */
.description-badge {
    color: #6b778c;
}

.attachment-badge {
    color: #0079bf;
}

.comment-badge {
    color: #36b37e;
}

/* Loading state */
.card-item.loading {
    opacity: 0.7;
    pointer-events: none;
}

/* Drag handle */
.drag-handle {
    cursor: grab;
    margin-right: 4px;
}

.drag-handle:active {
    cursor: grabbing;
}

.title-input {
    width: 100%;
    padding: 4px;
    margin: 0 0 4px;
    font-size: 14px;
    font-weight: 500;
    border: 2px solid #0079bf;
    border-radius: 3px;
    background: white;
}
</style>