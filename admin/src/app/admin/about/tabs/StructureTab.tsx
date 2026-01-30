'use client'

import { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  NodeProps,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

/* ----------------------------------
   UTILITY FUNCTIONS
-----------------------------------*/
const download = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/* ----------------------------------
   DEFAULT STYLES
-----------------------------------*/
const DEFAULT_EDGE_OPTIONS: any = {
  type: 'smoothstep',
  markerEnd: { type: 'arrowclosed' },
  style: { stroke: '#14b8a6', strokeWidth: 2 },
}

/* ----------------------------------
   Mock data (backend оронд)
-----------------------------------*/
const initialNodes: Node[] = [
  // Level 1: Board
  { id: 'tuz', type: 'org', position: { x: 800, y: 0 }, data: { label: 'ТУЗ', isRoot: true } },
  
  // Level 2: Board Committees & CEO
  { id: 'ersdeliin-udirdlaga-hooro', type: 'org', position: { x: 200, y: 140 }, data: { label: 'Эрсдэлийн удирдлага, тогтвортой хөгжлийн хороо' } },
  { id: 'zasaglal-ner-devshuuleh-hooro', type: 'org', position: { x: 500, y: 140 }, data: { label: 'Засаглал, нэр дэвшүүлэх хороо' } },
  { id: 'audityn-hooro', type: 'org', position: { x: 800, y: 140 }, data: { label: 'Аудитын хороо' } },
  { id: 'dotood-audityn-helts', type: 'org', position: { x: 1100, y: 140 }, data: { label: 'Дотоод аудитын хэлтэс' } },
  { id: 'gezen-zasuulah', type: 'org', position: { x: 800, y: 280 }, data: { label: 'Гүйцэтгэх захирал' } },
  
  // Level 3: CEO Direct Reports (Boards & Deputy Directors)
  { id: 'udirdlagyn-hooro', type: 'org', position: { x: 200, y: 420 }, data: { label: 'Удирдлагын хороо' } },
  { id: 'aktiv-passivyn-hooro', type: 'org', position: { x: 400, y: 420 }, data: { label: 'Актив, пассивын удирдлагын хороо' } },
  { id: 'ersdeliin-udirdlagan-hooro', type: 'org', position: { x: 600, y: 420 }, data: { label: 'Эрсдэлийн удирдлагын хороо' } },
  { id: 'zeeliin-hooro', type: 'org', position: { x: 800, y: 420 }, data: { label: 'Зээлийн хороо' } },
  { id: 'yos-zuiin-hooro', type: 'org', position: { x: 1000, y: 420 }, data: { label: 'Ёс зүйн хороо' } },
  
  // 1. Business Deputy Director
  { id: 'biznes-haruutssan-ded-zasuulah', type: 'org', position: { x: 50, y: 560 }, data: { label: 'Бизнес хариуцсан дэд захирал' } },
  { id: 'biznes-buegedekhuen-hoguuleltyn-gazar', type: 'org', position: { x: 50, y: 700 }, data: { label: 'Бизнесийн бүтээгдэхүүн хөгжүүлэлтийн газар' } },
  { id: 'biznes-hariltsaany-gazar', type: 'org', position: { x: 200, y: 700 }, data: { label: 'Бизнес харилцааны газар' } },
  { id: 'salbaa-banknoor', type: 'org', position: { x: 350, y: 700 }, data: { label: 'Салбар (Банкноор)' } },
  { id: 'biznes-zeeliin-gazar', type: 'org', position: { x: 500, y: 700 }, data: { label: 'Бизнесийн зээлийн газар' } },
  { id: 'baigu-zeeliin-helts', type: 'org', position: { x: 50, y: 840 }, data: { label: 'Байгууллагын зээлийн хэлтэс' } },
  { id: 'biznes-tov-salbaa', type: 'org', position: { x: 200, y: 840 }, data: { label: 'Бизнес төв (Салбар)' } },
  
  // 2. Marketing Deputy Director
  { id: 'marketing-hariltsaany-udirdlaga', type: 'org', position: { x: 650, y: 560 }, data: { label: 'Маркетинг, харилцааны удирдлага' } },
  { id: 'marketing-yilchilgeeniy-gazar', type: 'org', position: { x: 650, y: 700 }, data: { label: 'Маркетингийн үйлчилгээний газар' } },
  { id: 'marketing-helts', type: 'org', position: { x: 800, y: 700 }, data: { label: 'Маркетингийн хэлтэс' } },
  { id: 'hariltsaa-holbooyn-helts', type: 'org', position: { x: 950, y: 700 }, data: { label: 'Харилцаа холбооны хэлтэс' } },
  
  // 3. Card Management Director
  { id: 'kartyn-udirdlaga-hyanaltyn-gazar', type: 'org', position: { x: 1200, y: 560 }, data: { label: 'Картын удирдлага, хяналтын газар' } },
  { id: 'kartyn-helts', type: 'org', position: { x: 1200, y: 700 }, data: { label: 'Картын хэлтэс' } },
  
  // 4. IT Deputy Director
  { id: 'medee-tehnologi-zasuulah', type: 'org', position: { x: 1350, y: 560 }, data: { label: 'Мэдээллийн технологи хариуцсан захирал' } },
  { id: 'it-yilchilgeeniy-gazar', type: 'org', position: { x: 1350, y: 700 }, data: { label: 'Мэдээллийн технологийн үйлчилгээний газар' } },
  { id: 'it-ded-buttsiin-helts', type: 'org', position: { x: 1200, y: 840 }, data: { label: 'IT-ийн дэд бүтцийн хэлтэс' } },
  { id: 'sistem-ashiglaltyn-helts', type: 'org', position: { x: 1350, y: 840 }, data: { label: 'Систем ашиглалтын хэлтэс' } },
  { id: 'data-udirdlagyn-helts', type: 'org', position: { x: 1500, y: 840 }, data: { label: 'Дата удирдлагын хэлтэс' } },
  { id: 'platform-hoguuleltyn-helts', type: 'org', position: { x: 1200, y: 980 }, data: { label: 'Платформ хөгжүүлэлтийн хэлтэс' } },
  { id: 'dotood-sistem-hoguuleltyn-helts', type: 'org', position: { x: 1350, y: 980 }, data: { label: 'Дотоод систем хөгжүүлэлтийн хэлтэс' } },
  
  // 5. Risk Deputy Director
  { id: 'ersdeliin-haruutssan-zasuulah', type: 'org', position: { x: 100, y: 1120 }, data: { label: 'Эрсдэл хариуцсан захирал' } },
  { id: 'ersdeliin-shinjileg-hyanalt-tailagna-helts', type: 'org', position: { x: 100, y: 1260 }, data: { label: 'Эрсдэлийн шинжилгээ, хяналт, тайлагналын хэлтэс' } },
  { id: 'ersdeliin-zagvar-hoguuleltyn-helts', type: 'org', position: { x: 300, y: 1260 }, data: { label: 'Эрсдэлийн загвар хөгжүүлэлтийн хэлтэс' } },
  { id: 'zeeliin-ersdeliin-udirdlagyn-helts', type: 'org', position: { x: 500, y: 1260 }, data: { label: 'Зээлийн эрсдэлийн удирдлагын хэлтэс' } },
  { id: 'uil-azhillagaany-ersdeliin-helts', type: 'org', position: { x: 700, y: 1260 }, data: { label: 'Үйл ажиллагааны эрсдэлийн хэлтэс' } },
  { id: 'tughai-aktivyn-helts', type: 'org', position: { x: 900, y: 1260 }, data: { label: 'Тусгай активын хэлтэс' } },
  
  // 6. Finance Deputy Director
  { id: 'sanhuu-haruutssan-zasuulah', type: 'org', position: { x: 1200, y: 1120 }, data: { label: 'Санхүү хариуцсан захирал' } },
  { id: 'burtel-tailangiin-helts', type: 'org', position: { x: 1050, y: 1260 }, data: { label: 'Бүртгэл, тайлангийн хэлтэс' } },
  { id: 'tolboo-toosoo-uil-azhillagaany-helts', type: 'org', position: { x: 1200, y: 1260 }, data: { label: 'Төлбөр тооцоо, үйл ажиллагааны хэлтэс' } },
  { id: 'sanhuu-udirdlagyn-helts', type: 'org', position: { x: 1350, y: 1260 }, data: { label: 'Санхүүгийн удирдлагын хэлтэс' } },
  { id: 'udirdlagyn-sanhuu-togtoltsooniy-helts', type: 'org', position: { x: 1050, y: 1400 }, data: { label: 'Удирдлагын санхүүгийн тогтолцооны хэлтэс' } },
  { id: 'horongu-oruulagyn-helts', type: 'org', position: { x: 1200, y: 1400 }, data: { label: 'Хөрөнгө оруулалтын хэлтэс' } },
  
  // 7. HR Deputy Director
  { id: 'huniin-noots-haruutssan-zasuulah', type: 'org', position: { x: 1450, y: 1120 }, data: { label: 'Хүний нөөц хариуцсан захирал' } },
  { id: 'baigu-huniin-hoguul-helts', type: 'org', position: { x: 1300, y: 1260 }, data: { label: 'Байгууллага, хүний хөгжил хэлтэс' } },
  { id: 'huniin-noots-yil-azhillagaany-helts', type: 'org', position: { x: 1450, y: 1260 }, data: { label: 'Хүний нөөцийн үйл ажиллагааны хэлтэс' } },
  { id: 'ofis-menedzhmentiyn-helts', type: 'org', position: { x: 1600, y: 1260 }, data: { label: 'Оффис менежментийн хэлтэс' } },
  { id: 'hudaldan-avaaltyn-helts', type: 'org', position: { x: 1300, y: 1400 }, data: { label: 'Худалдан авалтын хэлтэс' } },
  
  // 8. Legal & Compliance
  { id: 'huuli-erh-zui-niitstuleltyn-gazar', type: 'org', position: { x: 1700, y: 1120 }, data: { label: 'Хууль, эрх зүй, нийцүүлэлтийн газар' } },
  { id: 'huuli-erh-zuiin-helts', type: 'org', position: { x: 1550, y: 1260 }, data: { label: 'Хууль, эрх зүйн хэлтэс' } },
  { id: 'niitstuleltyn-helts', type: 'org', position: { x: 1700, y: 1260 }, data: { label: 'Нийцүүлэлтийн хэлтэс' } },
  { id: 'zahargiaan-helts', type: 'org', position: { x: 1850, y: 1260 }, data: { label: 'Захиргааны хэлтэс' } },
  
  // 9. Support Units
  { id: 'busad-demeeh-negjuud', type: 'org', position: { x: 1900, y: 1120 }, data: { label: 'Бусад дэмжих нэгжүүд' } },
  { id: 'data-udirdlagyn-helts-2', type: 'org', position: { x: 1750, y: 1260 }, data: { label: 'Дата удирдлагын хэлтэс' } },
  { id: 'compliance-helts', type: 'org', position: { x: 1900, y: 1260 }, data: { label: 'Комплаенсийн хэлтэс' } },
  { id: 'medee-ayulgui-baydalgyn-helts', type: 'org', position: { x: 2050, y: 1260 }, data: { label: 'Мэдээллийн аюулгүй байдлын хэлтэс' } },
]

const initialEdges: Edge[] = [
  // TUZ → Board Committees & CEO
  { id: 'e1', source: 'tuz', target: 'ersdeliin-udirdlaga-hooro', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e2', source: 'tuz', target: 'zasaglal-ner-devshuuleh-hooro', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e3', source: 'tuz', target: 'audityn-hooro', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e4', source: 'tuz', target: 'dotood-audityn-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e5', source: 'tuz', target: 'gezen-zasuulah', ...DEFAULT_EDGE_OPTIONS },
  
  // CEO → Direct Reports
  { id: 'e6', source: 'gezen-zasuulah', target: 'udirdlagyn-hooro', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e7', source: 'gezen-zasuulah', target: 'aktiv-passivyn-hooro', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e8', source: 'gezen-zasuulah', target: 'ersdeliin-udirdlagan-hooro', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e9', source: 'gezen-zasuulah', target: 'zeeliin-hooro', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e10', source: 'gezen-zasuulah', target: 'yos-zuiin-hooro', ...DEFAULT_EDGE_OPTIONS },
  
  // Deputy Directors
  { id: 'e11', source: 'gezen-zasuulah', target: 'biznes-haruutssan-ded-zasuulah', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e12', source: 'gezen-zasuulah', target: 'marketing-hariltsaany-udirdlaga', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e13', source: 'gezen-zasuulah', target: 'kartyn-udirdlaga-hyanaltyn-gazar', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e14', source: 'gezen-zasuulah', target: 'medee-tehnologi-zasuulah', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e15', source: 'gezen-zasuulah', target: 'ersdeliin-haruutssan-zasuulah', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e16', source: 'gezen-zasuulah', target: 'sanhuu-haruutssan-zasuulah', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e17', source: 'gezen-zasuulah', target: 'huniin-noots-haruutssan-zasuulah', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e18', source: 'gezen-zasuulah', target: 'huuli-erh-zui-niitstuleltyn-gazar', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e19', source: 'gezen-zasuulah', target: 'busad-demeeh-negjuud', ...DEFAULT_EDGE_OPTIONS },
  
  // Business Division
  { id: 'e20', source: 'biznes-haruutssan-ded-zasuulah', target: 'biznes-buegedekhuen-hoguuleltyn-gazar', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e21', source: 'biznes-haruutssan-ded-zasuulah', target: 'biznes-hariltsaany-gazar', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e22', source: 'biznes-haruutssan-ded-zasuulah', target: 'salbaa-banknoor', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e23', source: 'biznes-haruutssan-ded-zasuulah', target: 'biznes-zeeliin-gazar', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e24', source: 'biznes-zeeliin-gazar', target: 'baigu-zeeliin-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e25', source: 'biznes-zeeliin-gazar', target: 'biznes-tov-salbaa', ...DEFAULT_EDGE_OPTIONS },
  
  // Marketing Division
  { id: 'e26', source: 'marketing-hariltsaany-udirdlaga', target: 'marketing-yilchilgeeniy-gazar', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e27', source: 'marketing-hariltsaany-udirdlaga', target: 'marketing-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e28', source: 'marketing-hariltsaany-udirdlaga', target: 'hariltsaa-holbooyn-helts', ...DEFAULT_EDGE_OPTIONS },
  
  // Card Division
  { id: 'e29', source: 'kartyn-udirdlaga-hyanaltyn-gazar', target: 'kartyn-helts', ...DEFAULT_EDGE_OPTIONS },
  
  // IT Division
  { id: 'e30', source: 'medee-tehnologi-zasuulah', target: 'it-yilchilgeeniy-gazar', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e31', source: 'it-yilchilgeeniy-gazar', target: 'it-ded-buttsiin-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e32', source: 'it-yilchilgeeniy-gazar', target: 'sistem-ashiglaltyn-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e33', source: 'it-yilchilgeeniy-gazar', target: 'data-udirdlagyn-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e34', source: 'it-yilchilgeeniy-gazar', target: 'platform-hoguuleltyn-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e35', source: 'it-yilchilgeeniy-gazar', target: 'dotood-sistem-hoguuleltyn-helts', ...DEFAULT_EDGE_OPTIONS },
  
  // Risk Division
  { id: 'e36', source: 'ersdeliin-haruutssan-zasuulah', target: 'ersdeliin-shinjileg-hyanalt-tailagna-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e37', source: 'ersdeliin-haruutssan-zasuulah', target: 'ersdeliin-zagvar-hoguuleltyn-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e38', source: 'ersdeliin-haruutssan-zasuulah', target: 'zeeliin-ersdeliin-udirdlagyn-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e39', source: 'ersdeliin-haruutssan-zasuulah', target: 'uil-azhillagaany-ersdeliin-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e40', source: 'ersdeliin-haruutssan-zasuulah', target: 'tughai-aktivyn-helts', ...DEFAULT_EDGE_OPTIONS },
  
  // Finance Division
  { id: 'e41', source: 'sanhuu-haruutssan-zasuulah', target: 'burtel-tailangiin-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e42', source: 'sanhuu-haruutssan-zasuulah', target: 'tolboo-toosoo-uil-azhillagaany-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e43', source: 'sanhuu-haruutssan-zasuulah', target: 'sanhuu-udirdlagyn-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e44', source: 'sanhuu-haruutssan-zasuulah', target: 'udirdlagyn-sanhuu-togtoltsooniy-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e45', source: 'sanhuu-haruutssan-zasuulah', target: 'horongu-oruulagyn-helts', ...DEFAULT_EDGE_OPTIONS },
  
  // HR Division
  { id: 'e46', source: 'huniin-noots-haruutssan-zasuulah', target: 'baigu-huniin-hoguul-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e47', source: 'huniin-noots-haruutssan-zasuulah', target: 'huniin-noots-yil-azhillagaany-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e48', source: 'huniin-noots-haruutssan-zasuulah', target: 'ofis-menedzhmentiyn-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e49', source: 'huniin-noots-haruutssan-zasuulah', target: 'hudaldan-avaaltyn-helts', ...DEFAULT_EDGE_OPTIONS },
  
  // Legal Division
  { id: 'e50', source: 'huuli-erh-zui-niitstuleltyn-gazar', target: 'huuli-erh-zuiin-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e51', source: 'huuli-erh-zui-niitstuleltyn-gazar', target: 'niitstuleltyn-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e52', source: 'huuli-erh-zui-niitstuleltyn-gazar', target: 'zahargiaan-helts', ...DEFAULT_EDGE_OPTIONS },
  
  // Support Units
  { id: 'e53', source: 'busad-demeeh-negjuud', target: 'data-udirdlagyn-helts-2', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e54', source: 'busad-demeeh-negjuud', target: 'compliance-helts', ...DEFAULT_EDGE_OPTIONS },
  { id: 'e55', source: 'busad-demeeh-negjuud', target: 'medee-ayulgui-baydalgyn-helts', ...DEFAULT_EDGE_OPTIONS },
]

/* ----------------------------------
   Custom node (dark, minimalist)
-----------------------------------*/
function OrgNode({ data }: NodeProps) {
  const { preview } = data as any

  return (
    <div
      className={`rounded-lg px-4 py-2 text-sm text-white bg-zinc-800 border border-zinc-700 shadow ${
        preview ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {!preview && <Handle type="target" position={Position.Top} />}
      {data.label}
      {!preview && <Handle type="source" position={Position.Bottom} />}
    </div>
  )
}

const nodeTypes = {
  org: OrgNode,
}

/* ----------------------------------
   AUTO LAYOUT ALGORITHM
-----------------------------------*/
const LEVEL_HEIGHT = 140
const SIBLING_GAP = 220

interface TreeNode extends Node {
  children?: TreeNode[]
  level?: number
}

function buildTree(nodes: Node[], parentId: string | null = null): TreeNode[] {
  return nodes
    .filter((n) => {
      // Олох parent id - edges-аас харна
      return !initialEdges.find(
        (e) => e.target === n.id && e.source !== parentId
      ) || parentId === null
    })
    .map((n) => ({
      ...n,
      children: buildTree(
        nodes,
        n.id
      ),
    }))
}

function assignLevels(node: TreeNode, level: number = 0): void {
  node.level = level
  node.children?.forEach((child) => assignLevels(child, level + 1))
}

function layoutChildren(children: TreeNode[], centerX: number): void {
  if (children.length === 0) return

  const totalWidth = (children.length - 1) * SIBLING_GAP
  children.forEach((child, i) => {
    child.position!.x = centerX - totalWidth / 2 + i * SIBLING_GAP
    if (child.children) {
      layoutChildren(child.children, child.position!.x)
    }
  })
}

function autoLayoutTree(nodes: Node[]): Node[] {
  // edges-ээс tree үүсгэ
  const findRoot = (nds: Node[]) =>
    nds.find(
      (n) => !initialEdges.some((e) => e.target === n.id)
    ) || nds[0]

  const root = findRoot(nodes)
  if (!root) return nodes

  // Clone nodes
  const layoutedNodes = nodes.map((n) => ({ ...n, position: { ...n.position } }))
  const rootNode = layoutedNodes.find((n) => n.id === root.id)!

  // Recursive tree build
  const getChildren = (parentId: string): Node[] =>
    layoutedNodes.filter(
      (n) =>
        initialEdges.some(
          (e) => e.source === parentId && e.target === n.id
        )
    )

  // Assign levels
  const assignLevelsRecursive = (node: Node, level: number = 0) => {
    node.position!.y = level * LEVEL_HEIGHT
    getChildren(node.id).forEach((child) =>
      assignLevelsRecursive(child, level + 1)
    )
  }

  // Assign X coordinates
  const assignXRecursive = (node: Node, centerX: number = 0) => {
    node.position!.x = centerX
    const children = getChildren(node.id)
    if (children.length > 0) {
      const totalWidth = (children.length - 1) * SIBLING_GAP
      children.forEach((child, i) => {
        const childX = centerX - totalWidth / 2 + i * SIBLING_GAP
        assignXRecursive(child, childX)
      })
    }
  }

  assignLevelsRecursive(rootNode)
  assignXRecursive(rootNode, 0)

  return layoutedNodes
}

/* ----------------------------------
   MAIN COMPONENT
-----------------------------------*/
export default function StructureTab({ 
  onSave, 
  loading 
}: { 
  onSave?: (data: any) => void
  loading?: boolean 
}) {
  const [editingNode, setEditingNode] = useState<Node | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [preview, setPreview] = useState(false)
  const [lastSavedState, setLastSavedState] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null)
  const [selectingRoot, setSelectingRoot] = useState<Node | null>(null)

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('org-chart')
    if (saved) {
      try {
        const parsedState = JSON.parse(saved)
        setNodes(parsedState.nodes)
        setEdges(parsedState.edges)
        setLastSavedState(parsedState)
      } catch (e) {
        console.error('Failed to load org chart:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Mark as dirty when current state differs from last saved state
  useEffect(() => {
    if (!isLoaded) return
    if (!lastSavedState) return

    setDirty(
      JSON.stringify({ nodes, edges }) !==
      JSON.stringify(lastSavedState)
    )
  }, [nodes, edges, isLoaded, lastSavedState])

  // Close modal when entering preview mode
  useEffect(() => {
    if (preview) {
      setEditingNode(null)
    }
  }, [preview])

  // Manual save function
  const saveChart = () => {
    const state = { nodes, edges }
    localStorage.setItem('org-chart', JSON.stringify(state))
    setLastSavedState(state)
    setDirty(false)
    alert('✅ Амжилттай хадгаллаа')
  }

  // Reset to last saved state
  const resetChart = () => {
    if (lastSavedState) {
      setNodes(lastSavedState.nodes)
      setEdges(lastSavedState.edges)
      setDirty(false)
      alert('↩️ Буцаалтыг амжилттай гүйцэтгэлээ')
    }
  }

  // Close modal when entering preview mode
  useEffect(() => {
    if (preview) {
      setEditingNode(null)
    }
  }, [preview])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Esc → Close modal
      if (e.key === 'Escape' && editingNode) {
        setEditingNode(null)
        return
      }

      // Enter → Save node
      if (e.key === 'Enter' && editingNode) {
        e.preventDefault()
        saveNodeLabel()
        return
      }

      // Delete → Delete node (not root)
      if (e.key === 'Delete' && editingNode && !editingNode.data?.isRoot) {
        e.preventDefault()
        deleteNode(editingNode.id)
        return
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editingNode])

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            ...DEFAULT_EDGE_OPTIONS,
          },
          eds
        )
      ),
    []
  )

  const addNode = () => {
    setNodes((nds) => [
      ...nds,
      {
        id: crypto.randomUUID(),
        type: 'org',
        position: { x: 500, y: 500 },
        data: { label: 'Шинэ нэгж' },
      },
    ])
  }

  const deleteNode = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return

    // Root дээр дарсан → modal нээ
    if (node.data?.isRoot) {
      setSelectingRoot(node)
      return
    }

    // Normal delete
    setNodes((nds) => nds.filter((n) => n.id !== nodeId))
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      )
    )
    setEditingNode(null)
  }

  const onNodeClick = (_: any, node: Node) => {
    setEditingNode(node)
    setEditLabel(node.data.label)
  }

  const saveNodeLabel = () => {
    if (!editingNode) return

    setNodes((nds) =>
      nds.map((n) =>
        n.id === editingNode.id
          ? { ...n, data: { ...n.data, label: editLabel } }
          : n
      )
    )

    setEditingNode(null)
  }


  const addChildNode = (parentId: string) => {
    const newId = crypto.randomUUID()
    const parentNode = nodes.find((n) => n.id === parentId)
    if (!parentNode) return

    // Шинэ child node үүсгэх (parent-ын доор)
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        type: 'org',
        position: {
          x: parentNode.position.x,
          y: parentNode.position.y + 200,
        },
        data: {
          label: 'Шинэ нэгж',
        },
      },
    ])

    // Edge автоматаар үүсгэх
    setEdges((eds) => [
      ...eds,
      {
        id: `e-${parentId}-${newId}`,
        source: parentId,
        target: newId,
        ...DEFAULT_EDGE_OPTIONS,
      },
    ])
  }

  // Export JSON
  const exportJSON = () => {
    const blob = new Blob(
      [JSON.stringify({ nodes, edges }, null, 2)],
      { type: 'application/json' }
    )
    download(blob, 'org-chart.json')
  }

  // Export PNG
  const exportPNG = async () => {
    try {
      let element = document.querySelector('.react-flow__pane') as HTMLElement
      if (!element) {
        element = document.querySelector('.react-flow') as HTMLElement
      }
      if (!element) {
        alert('Диаграммыг олох боломжгүй')
        return
      }

      // Dynamic import html-to-image
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        skipFonts: true,
        style: {
          padding: '40px',
        } as any,
      })

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'org-chart.png'
      link.click()
      alert('✅ PNG амжилттай экспортлогдлоо')
    } catch (err) {
      console.error('PNG экспорт амжилтгүй:', err)
      alert(`PNG экспорт амжилтгүй болсон: ${err instanceof Error ? err.message : 'Үл мэдэгдэх алдаа'}`)
    }
  }

  return (
    <div className="h-screen w-full bg-black">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="text-white font-medium">
            Байгууллагын бүтэц
          </div>
          {dirty && (
            <span className="text-xs text-yellow-400 flex items-center gap-1">
              ● Өөрчлөлт хадгалагдаагүй
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={saveChart}
            className="px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700 font-semibold"
          >
             Хадгалах
          </button>
          <button
            onClick={resetChart}
            disabled={!dirty}
            className={`px-3 py-1.5 text-sm rounded ${dirty ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 cursor-not-allowed'} text-white font-semibold`}
          >
            ↩ Буцаах
          </button>
          <button
            onClick={addNode}
            className="px-3 py-1.5 text-sm rounded bg-teal-600 text-white hover:bg-teal-700"
          >
            + Нэгж нэмэх
          </button>
          <button
            onClick={exportJSON}
            className="px-3 py-1.5 text-sm rounded bg-blue-700 text-white hover:bg-blue-800"
          >
             JSON
          </button>
          <button
            onClick={exportPNG}
            className="px-3 py-1.5 text-sm rounded bg-purple-700 text-white hover:bg-purple-800"
          >
             PNG
          </button>
          <button
            onClick={() => setPreview((p) => !p)}
            className={`px-3 py-1.5 text-sm rounded ${
              preview
                ? 'bg-zinc-700 text-zinc-300'
                : 'bg-teal-600 text-white'
            }`}
          >
            👁 Preview
          </button>
        </div>
      </div>

      {/* FLOW */}
      <ReactFlow
        style={{ background: preview ? '#ffffff' : '#000000' }}
        className={preview ? 'rf-preview' : ''}
        nodes={nodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            preview,
          },
        }))}
        edges={edges.map((e) =>
          preview
            ? {
                ...e,
                markerEnd: undefined,
              }
            : e
        )}
        nodeTypes={nodeTypes}
        onNodesChange={preview ? undefined : onNodesChange}
        onEdgesChange={preview ? undefined : onEdgesChange}
        onConnect={preview ? undefined : onConnect}
        onNodeClick={preview ? undefined : onNodeClick}
        nodesDraggable={!preview}
        nodesConnectable={!preview}
        elementsSelectable={!preview}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
      >
        {!preview && (
          <>
            <Background variant={BackgroundVariant.Dots} gap={32} color="#1f2933" />
            <Controls />
          </>
        )}
      </ReactFlow>

      {/* EDIT MODAL */}
      {editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[360px] rounded-lg bg-zinc-900 p-4 border border-zinc-700">
            <div className="text-white font-medium mb-3">
              Нэгжийн нэр засах
            </div>

            <input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full rounded bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white outline-none focus:border-teal-500 mb-4"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => deleteNode(editingNode.id)}
                disabled={editingNode.data?.isRoot}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  editingNode.data?.isRoot
                    ? 'bg-zinc-600 text-zinc-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Устгах
              </button>
              <button
                onClick={() => setEditingNode(null)}
                className="px-3 py-1.5 text-sm rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
              >
                Болих
              </button>
              <button
                onClick={saveNodeLabel}
                className="px-3 py-1.5 text-sm rounded bg-teal-600 text-white hover:bg-teal-700 transition-colors"
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROOT SELECTION MODAL */}
      {selectingRoot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-[420px] rounded-lg bg-zinc-900 p-4 border border-zinc-700">
            <div className="text-white font-medium mb-2">
              Root нэгж солих
            </div>

            <p className="text-sm text-zinc-400 mb-4">
              &quot;{selectingRoot.data.label}&quot; нь одоогийн root байна.
              <br />
              Шинэ root нэгжийг сонгоно уу.
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {nodes
                .filter((n) => n.id !== selectingRoot.id)
                .map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      // Promote new node to root
                      setNodes((nds) =>
                        nds.map((nd) => ({
                          ...nd,
                          data: {
                            ...nd.data,
                            isRoot: nd.id === n.id,
                          },
                        }))
                      )
                      // Remove parent edge from new root
                      setEdges((eds) => eds.filter((e) => e.target !== n.id))
                      // Delete old root
                      setNodes((nds) => nds.filter((nd) => nd.id !== selectingRoot.id))
                      setEdges((eds) =>
                        eds.filter(
                          (e) => e.source !== selectingRoot.id && e.target !== selectingRoot.id
                        )
                      )
                      setSelectingRoot(null)
                      setEditingNode(null)
                    }}
                    className="w-full text-left px-3 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 transition-colors text-sm"
                  >
                    {n.data.label}
                  </button>
                ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectingRoot(null)}
                className="px-3 py-1.5 text-sm rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
              >
                Болих
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        :root {
          --color-teal-700: #0d9488;
        }
        .rf-preview .react-flow__pane,
        .rf-preview .react-flow__viewport {
          background: white !important;
        }
      `}</style>
    </div>
  )
}
