import { Text } from '@react-three/drei'
import { aboutCopy, cafeCopy, contactCopy, servicesCopy } from './content'
import { INTERIOR_LAYOUT } from './interiorLayout'

function Label({
  children,
  position,
  rotation = [0, 0, 0],
  fontSize = 0.22,
  color = '#1c2420',
  maxWidth = 3.5,
  anchorX = 'center',
  anchorY = 'middle',
  textAlign = 'center',
}) {
  return (
    <Text
      position={position}
      rotation={rotation}
      fontSize={fontSize}
      color={color}
      maxWidth={maxWidth}
      anchorX={anchorX}
      anchorY={anchorY}
      textAlign={textAlign}
      lineHeight={1.25}
      letterSpacing={0.01}
      font={undefined}
    >
      {children}
    </Text>
  )
}

/** Framed wall poster with copy */
export function WallPoster({ position, rotation = [0, 0, 0], width = 2.4, height = 1.8, title, body, accent = '#e85d2c' }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[width + 0.12, height + 0.12, 0.08]} />
        <meshStandardMaterial color="#5a5048" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial color="#f4efe6" />
      </mesh>
      <mesh position={[0, height * 0.35, 0.08]}>
        <boxGeometry args={[width * 0.7, 0.06, 0.02]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <Label position={[0, height * 0.22, 0.09]} fontSize={0.2} maxWidth={width * 0.85} color="#1c2420">
        {title}
      </Label>
      <Label position={[0, -0.05, 0.09]} fontSize={0.12} maxWidth={width * 0.8} color="#3a4540">
        {body}
      </Label>
    </group>
  )
}

/** Cork / notice board with pinned cards */
export function NoticeBoard({ position, rotation = [0, 0, 0], cards = [] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.6, 2.4, 0.1]} />
        <meshStandardMaterial color="#c4a574" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[3.4, 2.2, 0.02]} />
        <meshStandardMaterial color="#d4b896" />
      </mesh>
      {cards.map((c, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const x = -1.1 + col * 1.1
        const y = 0.65 - row * 0.85
        return (
          <group key={i} position={[x, y, 0.1]} rotation={[0, 0, (i % 2 === 0 ? -1 : 1) * 0.04]}>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.7, 0.03]} />
              <meshStandardMaterial color={c.color || '#f4efe6'} />
            </mesh>
            <mesh position={[0, 0.28, 0.03]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#e85d2c" />
            </mesh>
            <Label position={[0, 0.08, 0.04]} fontSize={0.09} maxWidth={0.75} color="#1c2420">
              {c.title}
            </Label>
            <Label position={[0, -0.12, 0.04]} fontSize={0.07} maxWidth={0.75} color="#4a5550">
              {c.text}
            </Label>
          </group>
        )
      })}
    </group>
  )
}

/** Tabletop map with pin + address — sits on the post-office counter */
export function ContactMap({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.05, 1.8]} />
        <meshStandardMaterial color="#6d5136" />
      </mesh>
      <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.35, 1.55]} />
        <meshStandardMaterial color="#dce8d4" />
      </mesh>
      {/* Abstract hills / roads on map */}
      <mesh position={[-0.3, 0.07, 0.1]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <circleGeometry args={[0.45, 16]} />
        <meshStandardMaterial color="#8fad72" />
      </mesh>
      <mesh position={[0.55, 0.07, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshStandardMaterial color="#6f8f63" />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <planeGeometry args={[0.08, 1.4]} />
        <meshStandardMaterial color="#c9a66b" />
      </mesh>
      <mesh position={[0.15, 0.08, -0.15]} rotation={[-Math.PI / 2, 0, 1.1]}>
        <planeGeometry args={[0.06, 1.0]} />
        <meshStandardMaterial color="#c9a66b" />
      </mesh>
      {/* Pin */}
      <mesh position={[0.2, 0.22, 0.05]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#e85d2c" emissive="#e85d2c" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0.2, 0.12, 0.05]}>
        <coneGeometry args={[0.04, 0.16, 8]} />
        <meshStandardMaterial color="#c45c3e" />
      </mesh>
      <Label position={[0, 0.08, 0.75]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.1} maxWidth={2.2} color="#1c2420">
        {`Hillfolk Studio\nThe Hills, North-East India`}
      </Label>
    </group>
  )
}

/** Standing info plaque / lectern card */
export function InfoPlaque({ position, rotation = [0, 0, 0], title, lines = [] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.12, 1.1, 0.12]} />
        <meshStandardMaterial color="#5a5048" />
      </mesh>
      <mesh position={[0, 1.25, 0.08]} rotation={[-0.25, 0, 0]} castShadow>
        <boxGeometry args={[1.3, 0.9, 0.06]} />
        <meshStandardMaterial color="#f4efe6" />
      </mesh>
      <mesh position={[0, 1.5, 0.12]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.02]} />
        <meshStandardMaterial color="#e85d2c" />
      </mesh>
      <Label position={[0, 1.42, 0.14]} rotation={[-0.25, 0, 0]} fontSize={0.11} maxWidth={1.1}>
        {title}
      </Label>
      <Label position={[0, 1.15, 0.16]} rotation={[-0.25, 0, 0]} fontSize={0.08} maxWidth={1.1} color="#3a4540">
        {lines.join('\n')}
      </Label>
    </group>
  )
}

export function AboutSignage() {
  const L = INTERIOR_LAYOUT.about
  const z = -L.depth / 2 + 0.35
  return (
    <group>
      <WallPoster
        position={[0, 2.6, z]}
        width={3.6}
        height={2.0}
        title={aboutCopy.title}
        body={`${aboutCopy.lead}\n\n${aboutCopy.why.pull}`}
      />
      <WallPoster
        position={[-6.5, 2.4, z]}
        width={2.6}
        height={1.7}
        title={aboutCopy.studio.heading}
        body={aboutCopy.studio.bullets.join('\n')}
        accent="#4f6f56"
      />
      <WallPoster
        position={[6.5, 2.4, z]}
        width={2.6}
        height={1.7}
        title="Why Hillfolk?"
        body={`${aboutCopy.why.pull}\n\n${aboutCopy.tag}`}
        accent="#c9a66b"
      />
      <InfoPlaque
        position={[-2, 0, 2]}
        rotation={[0, 0.4, 0]}
        title="Studio note"
        lines={[aboutCopy.studio.note]}
      />
    </group>
  )
}

export function ServicesSignage() {
  const L = INTERIOR_LAYOUT.services
  const z = -L.depth / 2 + 0.4
  return (
    <group>
      <Label position={[0, 4.55, z + 0.05]} fontSize={0.28} maxWidth={8} color="#e85d2c">
        {servicesCopy.title}
      </Label>
      <Label position={[0, 4.15, z + 0.05]} fontSize={0.14} maxWidth={9} color="#3a4540">
        {servicesCopy.lead}
      </Label>
      <NoticeBoard
        position={[0, 2.2, 3.5]}
        rotation={[0, Math.PI, 0]}
        cards={servicesCopy.pillars.map((p, i) => ({
          title: p.title,
          text: p.text,
          color: ['#f4efe6', '#e8dcc8', '#dfece4', '#f0e6d4', '#e8ebe4'][i % 5],
        }))}
      />
      {servicesCopy.pillars.slice(0, 4).map((p, i) => (
        <group key={p.title} position={[-4.5 + i * 3.0, 2.6, z]}>
          <mesh castShadow>
            <boxGeometry args={[2.4, 1.6, 0.08]} />
            <meshStandardMaterial color="#f7f1e7" />
          </mesh>
          <mesh position={[0, 0.55, 0.05]}>
            <boxGeometry args={[1.6, 0.08, 0.02]} />
            <meshStandardMaterial color="#e85d2c" />
          </mesh>
          <Label position={[0, 0.25, 0.06]} fontSize={0.14} maxWidth={2.0}>
            {p.title}
          </Label>
          <Label position={[0, -0.15, 0.06]} fontSize={0.1} maxWidth={2.0} color="#4a5550">
            {p.text}
          </Label>
        </group>
      ))}
    </group>
  )
}

export function CafeSignage() {
  const L = INTERIOR_LAYOUT.cafe
  const z = -L.depth / 2 + 0.35
  return (
    <group>
      <WallPoster
        position={[0, 3.1, z]}
        width={3.2}
        height={1.9}
        title={cafeCopy.title}
        body={`${cafeCopy.lead}\n\n"${cafeCopy.quote}"`}
        accent="#e85d2c"
      />
      {/* Chalkboard menu */}
      <group position={[-6.5, 2.5, z]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 2.0, 0.1]} />
          <meshStandardMaterial color="#2f3a34" />
        </mesh>
        <Label position={[0, 0.55, 0.07]} fontSize={0.16} color="#f4efe6" maxWidth={2}>
          Today
        </Label>
        <Label position={[0, 0.1, 0.07]} fontSize={0.11} color="#d8cfc2" maxWidth={2}>
          {`Hill coffee\nFresh ideas\nLong walks\nHonest talk`}
        </Label>
      </group>
      <InfoPlaque
        position={[5.5, 0, 2]}
        rotation={[0, -0.5, 0]}
        title={cafeCopy.kicker}
        lines={[cafeCopy.lead, cafeCopy.quote]}
      />
    </group>
  )
}

export function ContactSignage() {
  const L = INTERIOR_LAYOUT.contact
  const z = -L.depth / 2 + 0.35
  return (
    <group>
      <WallPoster
        position={[-5.5, 2.5, z]}
        width={2.5}
        height={1.8}
        title={contactCopy.title}
        body={contactCopy.lead}
        accent="#4f6f56"
      />
      {/* Contact cards on counter wall */}
      <group position={[3.5, 2.4, z]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 2.2, 0.1]} />
          <meshStandardMaterial color="#4f6f56" />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[2.9, 1.9, 0.04]} />
          <meshStandardMaterial color="#f4efe6" />
        </mesh>
        <Label position={[0, 0.6, 0.1]} fontSize={0.16} maxWidth={2.5}>
          Get in touch
        </Label>
        {contactCopy.contacts.map((c, i) => (
          <Label key={c.kind} position={[0, 0.25 - i * 0.28, 0.1]} fontSize={0.11} maxWidth={2.5} color="#3a4540">
            {`${c.kind}:  ${c.value}`}
          </Label>
        ))}
      </group>
      <ContactMap position={[2.2, 1.52, -2.5]} />
      <InfoPlaque
        position={[-6.5, 0, 3]}
        rotation={[0, 0.6, 0]}
        title="Visit us"
        lines={['The Hills', 'North-East India', 'hello@hillfolkinc.com']}
      />
    </group>
  )
}
