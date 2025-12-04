#!/usr/bin/env node

// MCP Server: Blockchain-style vow verification ledger
// Used by Kiro IDE during development to query Theo & Selene's promise history
// Demonstrates real MCP integration for the Frankenstein hackathon

const vows = new Map()

// Seed data for Theo and Selene's story
vows.set('theo-marry-selene', { 
  person: 'Theo', 
  vow: 'Marry Selene', 
  kept: false, 
  timestamp: '2039-01-15',
  reason: 'Fled due to fear of his own darkness'
})

vows.set('theo-return', { 
  person: 'Theo', 
  vow: 'Return to make amends', 
  kept: true, 
  timestamp: '2039-06-20',
  reason: 'Came back to fulfill his promise, but too late'
})

vows.set('selene-wait', {
  person: 'Selene',
  vow: 'Wait for Theo',
  kept: true,
  timestamp: '2039-01-15',
  reason: 'Waited faithfully, but locked him out when he returned'
})

vows.set('harlan-protect-family', {
  person: 'Harlan',
  vow: 'Protect family with science',
  kept: false,
  timestamp: '2039-06-20',
  reason: 'Eternal Harmony experiment failed, trapped family in limbo'
})

const server = {
  name: 'blockchain-vows',
  version: '1.0.0',
  
  tools: [
    {
      name: 'check_vow',
      description: 'Check if a vow/promise was kept in the blockchain ledger. Returns details about the vow including whether it was kept and why.',
      inputSchema: {
        type: 'object',
        properties: {
          person: { 
            type: 'string', 
            description: 'Who made the vow (e.g., Theo, Selene, Harlan, Elara, Mira)' 
          },
          vow: { 
            type: 'string', 
            description: 'What was promised (e.g., "Marry Selene", "Return", "Wait")' 
          }
        },
        required: ['person', 'vow']
      }
    },
    {
      name: 'record_vow',
      description: 'Record a new vow in the blockchain ledger with timestamp',
      inputSchema: {
        type: 'object',
        properties: {
          person: { type: 'string', description: 'Who made the vow' },
          vow: { type: 'string', description: 'What was promised' },
          kept: { type: 'boolean', description: 'Was the vow kept?' },
          reason: { type: 'string', description: 'Why was it kept or broken?' }
        },
        required: ['person', 'vow', 'kept']
      }
    },
    {
      name: 'list_all_vows',
      description: 'List all vows in the ledger for all characters',
      inputSchema: {
        type: 'object',
        properties: {}
      }
    }
  ]
}

function handleToolCall(name, args) {
  if (name === 'check_vow') {
    const key = `${args.person.toLowerCase()}-${args.vow.toLowerCase().replace(/\s+/g, '-')}`
    const record = vows.get(key)
    
    if (record) {
      return {
        found: true,
        person: record.person,
        vow: record.vow,
        kept: record.kept,
        timestamp: record.timestamp,
        reason: record.reason,
        message: record.kept 
          ? `✓ Vow kept: ${record.person} did ${record.vow} on ${record.timestamp}. ${record.reason}`
          : `✗ Vow broken: ${record.person} failed to ${record.vow}. ${record.reason}`
      }
    }
    
    return { 
      found: false, 
      message: `No record of vow "${args.vow}" by ${args.person} in the blockchain ledger` 
    }
  }
  
  if (name === 'record_vow') {
    const key = `${args.person.toLowerCase()}-${args.vow.toLowerCase().replace(/\s+/g, '-')}`
    const record = {
      person: args.person,
      vow: args.vow,
      kept: args.kept,
      reason: args.reason || 'No reason provided',
      timestamp: new Date().toISOString()
    }
    vows.set(key, record)
    return { 
      success: true, 
      message: `Vow recorded on blockchain: ${args.person} - ${args.vow} (${args.kept ? 'kept' : 'broken'})`,
      record
    }
  }
  
  if (name === 'list_all_vows') {
    const allVows = Array.from(vows.values())
    return {
      count: allVows.length,
      vows: allVows,
      message: `Found ${allVows.length} vows in the blockchain ledger`
    }
  }
  
  return { error: 'Unknown tool' }
}

// MCP protocol handler (stdio-based communication)
let buffer = ''

process.stdin.on('data', (chunk) => {
  buffer += chunk.toString()
  
  // Process complete JSON messages (newline-delimited)
  const lines = buffer.split('\n')
  buffer = lines.pop() || ''
  
  for (const line of lines) {
    if (!line.trim()) continue
    
    try {
      const request = JSON.parse(line)
      
      if (request.method === 'initialize') {
        const response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: server,
            capabilities: {
              tools: {}
            }
          }
        }
        process.stdout.write(JSON.stringify(response) + '\n')
      }
      else if (request.method === 'tools/list') {
        const response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: server.tools
          }
        }
        process.stdout.write(JSON.stringify(response) + '\n')
      }
      else if (request.method === 'tools/call') {
        const result = handleToolCall(request.params.name, request.params.arguments)
        const response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              { 
                type: 'text', 
                text: JSON.stringify(result, null, 2)
              }
            ]
          }
        }
        process.stdout.write(JSON.stringify(response) + '\n')
      }
    } catch (error) {
      console.error('Error processing request:', error)
    }
  }
})

console.error('Blockchain Vows MCP Server started - Ready to verify promises')
