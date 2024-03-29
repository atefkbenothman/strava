import React from "react"
import { useEffect, useState } from "react"
// swr
import useSWR from "swr"
// api
import { getAthleteActivities } from "@/utils/api"
// components
import PageContent from "@/components/pageContent"
import ActivityCard from "@/components/activityCard"
import LoginFirst from "@/components/loginFirst"
import LoadingIndicator from "@/components/loadingIndicator"
import ErrorCard from "@/components/errorCard"

export default function Activities() {
  const [stravaAccessToken, setStravaAccessToken] = useState<string | null>("")

  useEffect(() => {
    setStravaAccessToken(window.sessionStorage.getItem("accessToken") || null)
  }, [])

  const {
    data: activities,
    error,
    isLoading
  } = useSWR(
    stravaAccessToken ? ["activities", stravaAccessToken] : null,
    ([key, token]) => getAthleteActivities(token),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onErrorRetry: (error) => {
        if (error.status === 429) return
      }
    }
  )

  if (error) {
    return (
      <div>
        <PageContent
          title="Activities"
          summary="View your recent activities."
        >
          <ErrorCard error={error} />
        </PageContent>
      </div>
    )
  }

  if (!stravaAccessToken) {
    return (
      <div>
        <PageContent
          title="Activities"
          summary="View your recent activities."
        >
          <div>
            <LoginFirst />
          </div>
        </PageContent>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <PageContent
          title="Activities"
          summary="View your recent activities."
        >
          <div className="w-fit mx-auto">
            <LoadingIndicator />
          </div>
        </PageContent>
      </div>
    )
  }

  return (
    <div>
      <PageContent
        title="Activities"
        summary="View your recent activities."
      >
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {Array.isArray(activities) &&
            activities.map((activity: any) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
        </div>
      </PageContent>
    </div>
  )
}
