export type Neuron = -1|1
export type Pattern = Neuron[]
export const emptyPattern = (width: number): Pattern => Array.from({ length: width }, () => -1)


export const plotPattern = (ctx: CanvasRenderingContext2D | null, pattern: Pattern, pixelSize: number, width: number) => {
    const bits = pattern.length
    ctx!.fillStyle = '#1a1a1a'
    ctx?.fillRect(0, 0, bits * pixelSize, bits * pixelSize)
    ctx!.fillStyle = '#646cff'
    const coords = (index: number) => ({ row: Math.floor((index)/width), col: index % width})
    if (pattern) {
            pattern.forEach((neuron, id) => {
            const { row, col } = coords(id)
            if (neuron === 1) ctx!.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize)
        })
    }
}