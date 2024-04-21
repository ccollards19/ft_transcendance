import React, { useEffect, useRef, useState } from "react"
import "./scrollbar.css"

const Scrollbar = ({ children }) => {
  const contentRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const scrollThumbRef = useRef(null);
  const observer = useRef(null);

  const [thumbHeight, setThumbHeight] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollStartPosition, setScrollStartPosition] = useState(0);
  const [initialContentScrollTop, setInitialContentScrollTop] = useState(0);

  function handleResize() {
    if (scrollTrackRef.current && contentRef.current) {
      const { clientHeight: trackSize } = scrollTrackRef.current;
      const {
        clientHeight: contentVisible,
        scrollHeight: contentTotalHeight
      } = contentRef.current
      setThumbHeight(
        Math.max((contentVisible / contentTotalHeight) * trackSize, 20)
      )
    }
  }

  function handleThumbPosition() {
    if (
      !contentRef.current ||
      !scrollTrackRef.current ||
      !scrollThumbRef.current
    ) {
      return
    }

    const {
      scrollTop: contentTop,
      scrollHeight: contentHeight
    } = contentRef.current;
    const { clientHeight: trackHeight } = scrollTrackRef.current;

    let newTop = (contentTop / contentHeight) * trackHeight
    newTop = Math.min(newTop, trackHeight - thumbHeight)

    const thumb = scrollThumbRef.current
    requestAnimationFrame(() => {
      thumb.style.top = `${newTop}px`
    })
  }

  useEffect(() => {
    if (contentRef.current) {
      const content = contentRef.current
      observer.current = new ResizeObserver(() => {
        handleResize()
      })
      observer.current.observe(content)
      content.addEventListener("scroll", handleThumbPosition)
      return () => {
        observer.current?.unobserve(content);
        content.removeEventListener("scroll", handleThumbPosition)
      }
    }
  }, [])

  function handleThumbMousedown(e) {
    e.preventDefault()
    e.stopPropagation()
    setScrollStartPosition(e.clientY)
    if (contentRef.current)
      setInitialContentScrollTop(contentRef.current.scrollTop)
    setIsDragging(true)
  }

  function handleThumbMouseup(e) {
    e.preventDefault()
    e.stopPropagation()
    if (isDragging) {
      setIsDragging(false)
    }
  }

  function handleThumbMousemove(e) {
    if (contentRef.current) {
      e.preventDefault()
      e.stopPropagation()
      if (isDragging) {
        const {
          scrollHeight: contentScrollHeight,
          clientHeight: contentClientHeight
        } = contentRef.current

        const deltaY =
          (e.clientY - scrollStartPosition) *
          (contentClientHeight / thumbHeight)

        const newScrollTop = Math.min(
          initialContentScrollTop + deltaY,
          contentScrollHeight - contentClientHeight
        )

        contentRef.current.scrollTop = newScrollTop
      }
    }
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleThumbMousemove)
    document.addEventListener("mouseup", handleThumbMouseup)
    return () => {
      document.removeEventListener("mousemove", handleThumbMousemove)
      document.removeEventListener("mouseup", handleThumbMouseup)
    }
  }, [handleThumbMousemove, handleThumbMouseup])

  function handleTrackClick(e) {
    e.preventDefault()
    e.stopPropagation()
    const { current: track } = scrollTrackRef
    const { current: content } = contentRef
    if (track && content) {
      const { clientY } = e
      const target = e.target
      const rect = target.getBoundingClientRect()
      const trackTop = rect.top
      const thumbOffset = -(thumbHeight / 2)
      const clickRatio = (clientY - trackTop + thumbOffset) / track.clientHeight
      const scrollAmount = Math.floor(clickRatio * content.scrollHeight)
      content.scrollTo({
        top: scrollAmount,
        behavior: "smooth"
      })
    }
  }

  function handleScrollButton(direction) {
    const { current: content } = contentRef
    if (content) {
      const scrollAmount = direction === "down" ? 200 : -200
      content.scrollBy({ top: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="container">
      <div className="content" id="custom-scrollbars-content" ref={contentRef}>
        {children}
      </div>
      <div className="scrollbar">
        <button
          className="button button--up"
          onClick={() => handleScrollButton("up")}
        >
          ↑
        </button>
        <div
          className="track-and-thumb"
          role="scrollbar"
          aria-controls="custom-scrollbars-content"
        >
          <div
            className="track"
            ref={scrollTrackRef}
            onClick={handleTrackClick}
            style={{ cursor: isDragging ? "grabbing" : undefined }}
          ></div>
          <div
            className="thumb"
            ref={scrollThumbRef}
            onMouseDown={handleThumbMousedown}
            style={{
              height: `${thumbHeight}px`,
              cursor: isDragging ? "grabbing" : "grab"
            }}
          ></div>
        </div>
        <button
          className="button button--down"
          onClick={() => handleScrollButton("down")}
        >
          ↓
        </button>
      </div>
    </div>
  )
}
export default Scrollbar