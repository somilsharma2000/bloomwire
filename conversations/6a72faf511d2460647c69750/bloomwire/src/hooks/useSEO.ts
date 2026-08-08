import { useEffect } from 'react'

export interface SEOOptions {
  title: string
  description: string
  canonicalPath?: string
  image?: string
  ogImage?: string
}

const BASE_URL = 'https://somilsharma2000.github.io/bloomwire'

export function useSEO({ title, description, canonicalPath, image, ogImage }: SEOOptions) {
  useEffect(() => {
    // 1. Page Title
    if (title) {
      document.title = title
    }

    // 2. Meta Description
    if (description) {
      let m = document.querySelector('meta[name="description"]')
      if (!m) {
        m = document.createElement('meta')
        m.setAttribute('name', 'description')
        document.head.appendChild(m)
      }
      m.setAttribute('content', description)
    }

    // 3. Open Graph Title & Description
    if (title) {
      let og = document.querySelector('meta[property="og:title"]')
      if (!og) {
        og = document.createElement('meta')
        og.setAttribute('property', 'og:title')
        document.head.appendChild(og)
      }
      og.setAttribute('content', title)
    }

    if (description) {
      let od = document.querySelector('meta[property="og:description"]')
      if (!od) {
        od = document.createElement('meta')
        od.setAttribute('property', 'og:description')
        document.head.appendChild(od)
      }
      od.setAttribute('content', description)
    }

    // 4. Open Graph & Twitter Image
    const imgUrl = image || ogImage
    if (imgUrl) {
      let oi = document.querySelector('meta[property="og:image"]')
      if (!oi) {
        oi = document.createElement('meta')
        oi.setAttribute('property', 'og:image')
        document.head.appendChild(oi)
      }
      oi.setAttribute('content', imgUrl)

      let ti = document.querySelector('meta[name="twitter:image"]')
      if (!ti) {
        ti = document.createElement('meta')
        ti.setAttribute('name', 'twitter:image')
        document.head.appendChild(ti)
      }
      ti.setAttribute('content', imgUrl)
    }

    // 5. Canonical URL & Open Graph URL
    const targetPath = canonicalPath || (typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') || window.location.pathname : '/')
    const cleanPath = targetPath.replace(/^(\/#|\/#\/|\/)+/, '/')
    const canonicalUrl = cleanPath === '/' ? `${BASE_URL}/` : `${BASE_URL}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`

    let c = document.querySelector('link[rel="canonical"]')
    if (!c) {
      c = document.createElement('link')
      c.setAttribute('rel', 'canonical')
      document.head.appendChild(c)
    }
    c.setAttribute('href', canonicalUrl)

    let u = document.querySelector('meta[property="og:url"]')
    if (!u) {
      u = document.createElement('meta')
      u.setAttribute('property', 'og:url')
      document.head.appendChild(u)
    }
    u.setAttribute('content', canonicalUrl)

    // 6. Twitter Title & Description
    if (title) {
      let t = document.querySelector('meta[name="twitter:title"]')
      if (!t) {
        t = document.createElement('meta')
        t.setAttribute('name', 'twitter:title')
        document.head.appendChild(t)
      }
      t.setAttribute('content', title)
    }

    if (description) {
      let td = document.querySelector('meta[name="twitter:description"]')
      if (!td) {
        td = document.createElement('meta')
        td.setAttribute('name', 'twitter:description')
        document.head.appendChild(td)
      }
      td.setAttribute('content', description)
    }
  }, [title, description, canonicalPath, image, ogImage])
}
