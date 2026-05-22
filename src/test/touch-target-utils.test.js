import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  assertTouchTargetSize,
  assertAllTouchTargetsAccessible,
} from './touch-target-utils'

describe('touch-target-utils', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  describe('assertTouchTargetSize', () => {
    it('passes for element meeting minimum size (44x44px)', () => {
      const button = document.createElement('button')
      button.style.width = '44px'
      button.style.height = '44px'
      container.appendChild(button)

      // Mock getBoundingClientRect for jsdom
      button.getBoundingClientRect = () => ({
        width: 44,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 44,
      })

      expect(() => assertTouchTargetSize(button)).not.toThrow()
    })

    it('passes for element larger than minimum size (50x60px)', () => {
      const button = document.createElement('button')
      button.style.width = '50px'
      button.style.height = '60px'
      container.appendChild(button)

      button.getBoundingClientRect = () => ({
        width: 50,
        height: 60,
        top: 0,
        left: 0,
        bottom: 60,
        right: 50,
      })

      expect(() => assertTouchTargetSize(button)).not.toThrow()
    })

    it('fails for element with width below minimum', () => {
      const button = document.createElement('button')
      button.style.width = '30px'
      button.style.height = '50px'
      container.appendChild(button)

      button.getBoundingClientRect = () => ({
        width: 30,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 30,
      })

      expect(() => assertTouchTargetSize(button)).toThrow(
        /Touch target too small: 30x50px/
      )
    })

    it('fails for element with height below minimum', () => {
      const button = document.createElement('button')
      button.style.width = '50px'
      button.style.height = '30px'
      container.appendChild(button)

      button.getBoundingClientRect = () => ({
        width: 50,
        height: 30,
        top: 0,
        left: 0,
        bottom: 30,
        right: 50,
      })

      expect(() => assertTouchTargetSize(button)).toThrow(
        /Touch target too small: 50x30px/
      )
    })

    it('fails for element with both dimensions below minimum', () => {
      const button = document.createElement('button')
      button.style.width = '20px'
      button.style.height = '20px'
      container.appendChild(button)

      button.getBoundingClientRect = () => ({
        width: 20,
        height: 20,
        top: 0,
        left: 0,
        bottom: 20,
        right: 20,
      })

      expect(() => assertTouchTargetSize(button)).toThrow(
        /Touch target too small: 20x20px \(minimum: 44x44px\)/
      )
    })

    it('accepts custom minimum size', () => {
      const button = document.createElement('button')
      button.style.width = '30px'
      button.style.height = '30px'
      container.appendChild(button)

      button.getBoundingClientRect = () => ({
        width: 30,
        height: 30,
        top: 0,
        left: 0,
        bottom: 30,
        right: 30,
      })

      expect(() => assertTouchTargetSize(button, 30)).not.toThrow()
      expect(() => assertTouchTargetSize(button, 40)).toThrow(
        /Touch target too small: 30x30px \(minimum: 40x40px\)/
      )
    })
  })

  describe('assertAllTouchTargetsAccessible', () => {
    it('passes when all buttons meet minimum size', () => {
      const button1 = document.createElement('button')
      button1.style.width = '50px'
      button1.style.height = '50px'
      container.appendChild(button1)
      button1.getBoundingClientRect = () => ({
        width: 50,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 50,
      })

      const button2 = document.createElement('button')
      button2.style.width = '44px'
      button2.style.height = '44px'
      container.appendChild(button2)
      button2.getBoundingClientRect = () => ({
        width: 44,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 44,
      })

      expect(() => assertAllTouchTargetsAccessible(container)).not.toThrow()
    })

    it('passes when all links meet minimum size', () => {
      const link = document.createElement('a')
      link.href = '#'
      link.style.width = '50px'
      link.style.height = '50px'
      link.style.display = 'block'
      container.appendChild(link)
      link.getBoundingClientRect = () => ({
        width: 50,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 50,
      })

      expect(() => assertAllTouchTargetsAccessible(container)).not.toThrow()
    })

    it('passes when all inputs meet minimum size', () => {
      const input = document.createElement('input')
      input.style.width = '200px'
      input.style.height = '44px'
      container.appendChild(input)
      input.getBoundingClientRect = () => ({
        width: 200,
        height: 44,
        top: 0,
        left: 0,
        bottom: 44,
        right: 200,
      })

      expect(() => assertAllTouchTargetsAccessible(container)).not.toThrow()
    })

    it('fails when any button is too small', () => {
      const button1 = document.createElement('button')
      button1.style.width = '50px'
      button1.style.height = '50px'
      container.appendChild(button1)
      button1.getBoundingClientRect = () => ({
        width: 50,
        height: 50,
        top: 0,
        left: 0,
        bottom: 50,
        right: 50,
      })

      const button2 = document.createElement('button')
      button2.style.width = '20px'
      button2.style.height = '20px'
      container.appendChild(button2)
      button2.getBoundingClientRect = () => ({
        width: 20,
        height: 20,
        top: 0,
        left: 0,
        bottom: 20,
        right: 20,
      })

      expect(() => assertAllTouchTargetsAccessible(container)).toThrow(
        /Touch target too small: 20x20px/
      )
    })

    it('checks elements with role="button"', () => {
      const div = document.createElement('div')
      div.setAttribute('role', 'button')
      div.style.width = '30px'
      div.style.height = '30px'
      container.appendChild(div)
      div.getBoundingClientRect = () => ({
        width: 30,
        height: 30,
        top: 0,
        left: 0,
        bottom: 30,
        right: 30,
      })

      expect(() => assertAllTouchTargetsAccessible(container)).toThrow(
        /Touch target too small: 30x30px/
      )
    })

    it('checks elements with tabindex="0"', () => {
      const div = document.createElement('div')
      div.setAttribute('tabindex', '0')
      div.style.width = '30px'
      div.style.height = '30px'
      container.appendChild(div)
      div.getBoundingClientRect = () => ({
        width: 30,
        height: 30,
        top: 0,
        left: 0,
        bottom: 30,
        right: 30,
      })

      expect(() => assertAllTouchTargetsAccessible(container)).toThrow(
        /Touch target too small: 30x30px/
      )
    })

    it('skips hidden elements (display: none)', () => {
      const button = document.createElement('button')
      button.style.width = '20px'
      button.style.height = '20px'
      button.style.display = 'none'
      container.appendChild(button)

      expect(() => assertAllTouchTargetsAccessible(container)).not.toThrow()
    })

    it('skips hidden elements (visibility: hidden)', () => {
      const button = document.createElement('button')
      button.style.width = '20px'
      button.style.height = '20px'
      button.style.visibility = 'hidden'
      container.appendChild(button)

      expect(() => assertAllTouchTargetsAccessible(container)).not.toThrow()
    })

    it('accepts custom minimum size', () => {
      const button = document.createElement('button')
      button.style.width = '30px'
      button.style.height = '30px'
      container.appendChild(button)
      button.getBoundingClientRect = () => ({
        width: 30,
        height: 30,
        top: 0,
        left: 0,
        bottom: 30,
        right: 30,
      })

      expect(() => assertAllTouchTargetsAccessible(container, 30)).not.toThrow()
      expect(() => assertAllTouchTargetsAccessible(container, 40)).toThrow(
        /Touch target too small: 30x30px/
      )
    })
  })
})
