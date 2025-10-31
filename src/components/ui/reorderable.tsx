import { cn } from '@/lib/utils'
import { GripVertical } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Card } from './card'

interface ReorderableListProps<T extends { order: number }> {
  // Array of objects that must have the 'order' property
  items: T[]
  // Callback function called when the items are reordered
  onReorder?: (items: T[]) => void
  // Function to render each item's content. Received (item, index) as parameters.
  renderItem?: (item: T, index: number) => React.ReactNode
  // Optional class name for the list container
  className?: string
  // Optional class name for items
  itemClassName?: string
  // Optional key extractor function. Defaults to index.
  keyExtractor?: (item: T, index: number) => string | number
}

export function ReorderableList<T extends { order: number }>({
  items,
  onReorder,
  renderItem,
  className,
  itemClassName,
  keyExtractor = (_, index) => index,
}: ReorderableListProps<T>) {
  const [sortedItems, setSortedItems] = useState<T[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragItemRef = useRef<number | null>(null)
  const dragNodeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sorted = [...items].sort((a, b) => a.order - b.order)
    setSortedItems(sorted)
  }, [items])

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    dragItemRef.current = index
    dragNodeRef.current = e.currentTarget as HTMLDivElement
    dragNodeRef.current.addEventListener('dragend', handleDragEnd)
    setDraggedIndex(index)

    // Set drag image with some opacity
    e.dataTransfer.effectAllowed = 'move'

    // Small timeout to allow the drag ghost to be created
    setTimeout(() => {
      if (dragNodeRef.current) {
        dragNodeRef.current.style.opacity = '0.5'
      }
    }, 0)
  }

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault()
    if (dragItemRef.current === index) return
    setDragOverIndex(index)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number,
  ) => {
    e.preventDefault()

    const dragIndex = dragItemRef.current
    if (dragIndex === dropIndex || dragIndex === null) return

    // Create a new array with the reordered items
    const newItems = [...sortedItems]
    const [draggedItem] = newItems.splice(dragIndex, 1)
    newItems.splice(dropIndex, 0, draggedItem)

    // Update order property for all items
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index,
    }))

    setSortedItems(updatedItems)

    if (onReorder) {
      onReorder(updatedItems)
    }
  }

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.style.opacity = '1'
      dragNodeRef.current.removeEventListener('dragend', handleDragEnd)
    }

    setDraggedIndex(null)
    setDragOverIndex(null)
    dragItemRef.current = null
    dragNodeRef.current = null
  }

  if (sortedItems.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        No items to display
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {sortedItems.map((item, index) => (
        <Card
          key={keyExtractor(item, index)}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDragDrop(e, index)}
          className={cn(
            'p-4 cursor-move transition-all duration-200',
            draggedIndex === index
              ? 'opacity-50 scale-95'
              : 'opacity-100 scale-100',
            dragOverIndex && draggedIndex !== index
              ? 'border-primary border-2'
              : '',
            itemClassName,
          )}
        >
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground hover:text-foreground transition-colors">
              <GripVertical className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              {renderItem ? (
                renderItem(item, index)
              ) : (
                <div className="text-sm font-medium">
                  {JSON.stringify(item)}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
