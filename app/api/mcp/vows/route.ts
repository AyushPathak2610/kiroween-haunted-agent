import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory vow ledger (simulates blockchain MCP)
const vows = new Map([
  ['theo-marry-selene', { person: 'Theo', vow: 'Marry Selene', kept: false, timestamp: '2039-01-15' }],
  ['theo-return', { person: 'Theo', vow: 'Return to make amends', kept: true, timestamp: '2039-06-20' }],
])

export async function POST(req: NextRequest) {
  try {
    const { action, person, vow } = await req.json()
    
    if (action === 'check') {
      const key = `${person.toLowerCase()}-${vow.toLowerCase().replace(/\s+/g, '-')}`
      const record = vows.get(key)
      
      if (record) {
        return NextResponse.json({
          found: true,
          ...record,
          message: record.kept 
            ? `✓ Vow kept: ${record.person} did ${record.vow} on ${record.timestamp}`
            : `✗ Vow broken: ${record.person} failed to ${record.vow}`
        })
      }
      
      return NextResponse.json({ 
        found: false, 
        message: 'No record of this vow in the ledger' 
      })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Vow check error:', error)
    return NextResponse.json({ error: 'Failed to check vow' }, { status: 500 })
  }
}
