export const container={
    hidden:{opacity:0},
    show:{
        opacity:1,
        transition:{
            staggerChildren:0.05,
        },
    },
}

export const item={
    hidden:{opacity:0, y:15},
    show:{
        opacity:1, 
        y:0,
        transition:{
            duration: 0.35,
            ease:"easeOut"as any
        }
    },
}