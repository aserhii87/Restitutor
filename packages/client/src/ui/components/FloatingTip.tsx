import { autoPlacement, getOverflowAncestors, offset, type Placement, shift, useFloating } from "@floating-ui/react";
import { type Factory, factory, getRefProp, isElement, Portal } from "@mantine/core";
import { useMergedRef } from "@mantine/hooks";
import { cls } from "@project/shared/src/utils/Helper";
import { cloneElement, memo, useCallback, useEffect, useRef, useState } from "react";

function FloatingTipOverlay({
   position,
   boundaryRef,
   cursorRef,
   label,
   fixedWidth,
   style,
   className,
}: {
   position: Placement;
   boundaryRef: React.RefObject<HTMLElement | null>;
   cursorRef: React.RefObject<{ x: number; y: number }>;
   label: () => React.ReactNode;
   fixedWidth?: boolean;
   style?: React.CSSProperties;
   className?: string;
}) {
   const placementRef = useRef(position);
   const animationFrameRef = useRef<number | null>(null);
   const [positionReference] = useState(() => ({
      getBoundingClientRect() {
         const { x, y } = cursorRef.current;
         return {
            width: 0,
            height: 0,
            x,
            y,
            left: x,
            // if placement is bottom, add 20px to offset cursor size!
            top: y + (placementRef.current.includes("bottom") ? 20 : 0),
            right: x,
            bottom: y,
         };
      },
   }));

   const { x, y, elements, refs, update, placement, isPositioned } = useFloating({
      open: true,
      placement: position,
      middleware: [offset(40), shift({ padding: 20 }), autoPlacement()],
   });

   const { setPositionReference } = refs;

   useEffect(() => {
      setPositionReference(positionReference);
   }, [setPositionReference, positionReference]);

   useEffect(() => {
      placementRef.current = placement;
   }, [placement]);

   const scheduleUpdate = useCallback(() => {
      if (!refs.floating.current || animationFrameRef.current !== null) {
         return;
      }
      animationFrameRef.current = requestAnimationFrame(() => {
         animationFrameRef.current = null;
         update();
      });
   }, [refs.floating, update]);

   const handleMouseMove = useCallback(
      ({ clientX, clientY }: MouseEvent) => {
         cursorRef.current.x = clientX;
         cursorRef.current.y = clientY;
         scheduleUpdate();
      },
      [cursorRef, scheduleUpdate],
   );

   useEffect(() => {
      const boundary = boundaryRef.current;
      if (!elements.floating || !boundary) {
         return;
      }

      boundary.addEventListener("mousemove", handleMouseMove);
      const parents = getOverflowAncestors(elements.floating);
      parents.forEach((parent) => {
         parent.addEventListener("scroll", scheduleUpdate);
      });

      return () => {
         boundary.removeEventListener("mousemove", handleMouseMove);
         parents.forEach((parent) => {
            parent.removeEventListener("scroll", scheduleUpdate);
         });
         if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
         }
      };
   }, [boundaryRef, elements.floating, handleMouseMove, scheduleUpdate]);

   return (
      <Portal reuseTargetNode>
         <div
            className={cls("floating-tip panel", className)}
            style={{
               ...style,
               top: 0,
               left: 0,
               transform: `translate(${Math.round(x ?? 0)}px, ${Math.round(y ?? 0)}px)`,
               visibility: isPositioned ? style?.visibility : "hidden",
               width: fixedWidth ? "30rem" : style?.width,
               maxWidth: fixedWidth ? "30rem" : style?.maxWidth,
            }}
            ref={refs.setFloating}
         >
            <FloatingTipContent label={label} />
         </div>
      </Portal>
   );
}

const FloatingTipContent = memo(({ label }: { label: () => React.ReactNode }) => <>{label()}</>);

export const FloatingTip = factory<
   Factory<{
      props: {
         className?: string;
         label: () => React.ReactNode;
         children: React.ReactNode;
         position?: Placement;
         disabled?: boolean;
         fixedWidth?: boolean;
         style?: React.CSSProperties;
      };
   }>
>(({ label, children, disabled, fixedWidth, style, className, position = "bottom", ref }) => {
   const [opened, setOpened] = useState(false);
   const boundaryRef = useRef<HTMLElement>(null);
   const cursorRef = useRef({ x: 0, y: 0 });

   if (!isElement(children)) {
      throw new Error(
         "FloatingTip component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported",
      );
   }

   const targetRef = useMergedRef(boundaryRef, getRefProp(children), ref);
   const _childrenProps = children.props as any;

   const onMouseEnter = (event: React.MouseEvent<unknown, MouseEvent>) => {
      _childrenProps.onMouseEnter?.(event);
      cursorRef.current.x = event.clientX;
      cursorRef.current.y = event.clientY;
      setOpened(true);
   };

   const onMouseLeave = (event: React.MouseEvent<unknown, MouseEvent>) => {
      _childrenProps.onMouseLeave?.(event);
      setOpened(false);
   };

   const shouldShow = !disabled && opened;

   return (
      <>
         {shouldShow && (
            <FloatingTipOverlay
               position={position}
               boundaryRef={boundaryRef}
               cursorRef={cursorRef}
               label={label}
               fixedWidth={fixedWidth}
               style={style}
               className={className}
            />
         )}

         {cloneElement(children, {
            ..._childrenProps,
            ref: targetRef,
            onMouseEnter,
            onMouseLeave,
         })}
      </>
   );
});
