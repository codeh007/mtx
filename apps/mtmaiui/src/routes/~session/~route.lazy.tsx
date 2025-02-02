import { createLazyFileRoute } from '@tanstack/react-router'
import { message } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useConfigStore } from '../../stores/agStore'
import { appContext } from '../../stores/agStoreProvider'
import type { Session } from '../components/types/datamodel'
import { sessionAPI } from './api'
import ChatView from './chat/chat'
import { SessionEditor } from './editor'
import { Sidebar } from './sidebar'


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from 'mtxuilib/ui/breadcrumb'
import { SidebarInset } from 'mtxuilib/ui/sidebar'
import { Suspense } from 'react'
import { DashContent } from '../../components/DashContent'
import { DashHeaders } from '../../components/DashHeaders'
import { DashSidebar } from '../../components/sidebar/siderbar'
import { RootAppWrapper } from '../components/RootAppWrapper'

export const Route = createLazyFileRoute('/session')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | undefined>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sessionSidebar')
      return stored !== null ? JSON.parse(stored) : true
    }
    return true // Default value during SSR
  })
  const [messageApi, contextHolder] = message.useMessage()

  const { user } = useContext(appContext)
  const { session, setSession, sessions, setSessions } = useConfigStore()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionSidebar', JSON.stringify(isSidebarOpen))
    }
  }, [isSidebarOpen])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // const fetchSessions = useCallback(async () => {
  //   if (!user?.email) return

  //   try {
  //     setIsLoading(true)
  //     const data = await sessionAPI.listSessions(user.email)
  //     setSessions(data)

  //     // Only set first session if there's no sessionId in URL
  //     const params = new URLSearchParams(window.location.search)
  //     const sessionId = params.get('sessionId')
  //     if (!session && data.length > 0 && !sessionId) {
  //       setSession(data[0])
  //     }
  //   } catch (error) {
  //     console.error('Error fetching sessions:', error)
  //     messageApi.error('Error loading sessions')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [user?.email, setSessions, session, setSession])

  // Handle initial URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('sessionId')

    if (sessionId && !session) {
      handleSelectSession({ id: Number.parseInt(sessionId) } as Session)
    }
  }, [])

  // Handle browser back/forward
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search)
      const sessionId = params.get('sessionId')

      if (!sessionId && session) {
        setSession(null)
      }
    }

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [session])


  const handleDeleteSession = async (sessionId: number) => {
    if (!user?.email) return

    try {
      const response = await sessionAPI.deleteSession(sessionId, user.email)
      setSessions(sessions.filter((s) => s.id !== sessionId))
      if (session?.id === sessionId || sessions.length === 0) {
        setSession(sessions[0] || null)
        window.history.pushState({}, '', window.location.pathname) // Clear URL params
      }
      messageApi.success('Session deleted')
    } catch (error) {
      console.error('Error deleting session:', error)
      messageApi.error('Error deleting session')
    }
  }

  const handleSelectSession = async (selectedSession: Session) => {
    if (!user?.email || !selectedSession.id) return

    try {
      setIsLoading(true)
      const data = await sessionAPI.getSession(selectedSession.id, user.email)
      if (!data) {
        // Session not found
        messageApi.error('Session not found')
        window.history.pushState({}, '', window.location.pathname) // Clear URL
        if (sessions.length > 0) {
          setSession(sessions[0]) // Fall back to first session
        } else {
          setSession(null)
        }
        return
      }
      setSession(data)
      window.history.pushState({}, '', `?sessionId=${selectedSession.id}`)
    } catch (error) {
      console.error('Error loading session:', error)
      messageApi.error('Error loading session')
      window.history.pushState({}, '', window.location.pathname) // Clear invalid URL
      if (sessions.length > 0) {
        setSession(sessions[0]) // Fall back to first session
      } else {
        setSession(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   fetchSessions()
  // }, [fetchSessions])
  return (
    <>
    <RootAppWrapper>
        <DashSidebar />
        <SidebarInset>
          <DashHeaders>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>posts</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </DashHeaders>
          <DashContent>
            <Suspense fallback={<div>Loading...</div>}>
      <div className="relative flex h-full w-full">
        {contextHolder}
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-200 ease-in-out ${
            isSidebarOpen ? 'w-64' : 'w-12'
          }`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            // sessions={sessions}
            currentSession={session}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onSelectSession={handleSelectSession}
            onEditSession={(session) => {
              setEditingSession(session)
              setIsEditorOpen(true)
            }}
            onDeleteSession={handleDeleteSession}
            isLoading={isLoading}
          />
        </div>

        <div
          className={`flex-1 transition-all -mr-4 duration-200 ${
            isSidebarOpen ? 'ml-64' : 'ml-12'
          }`}
        >
          {session && sessions.length > 0 ? (
            <div className="pl-4">
              {session && <ChatView session={session} />}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              No session selected. Create or select a session from the sidebar.
            </div>
          )}
        </div>

        <SessionEditor
          session={editingSession}
          isOpen={isEditorOpen}
          // onSave={handleSaveSession}
          onCancel={() => {
            setIsEditorOpen(false)
            setEditingSession(undefined)
          }}
        />
      </div>
      
    </Suspense>
          </DashContent>
        </SidebarInset>
      </RootAppWrapper>
    </>
  )
}
