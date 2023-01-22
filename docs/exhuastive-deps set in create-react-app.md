https://newbedev.com/understanding-the-react-hooks-exhaustive-deps-lint-rule

> useEffect is best used for side-effects, but here you're using it as a sort of "subscription" concept, like: "do X when Y changes". That does sort of work functionally, due to the mechanics of the deps array, (though in this case you're also calling onChange on initial render, which is probably unwanted), but it's not the intended purpose.

I've not run into problems with the `react-hooks/exhaustive-deps` eslint rule before, and this one came up.

Actual solution to the problem with this example is moving fetching to the parent 
 
```
  useEffect(() => { 
    const run = async () => {
      const privateResumes = await listingsService.queryPrivateResumes() // <- culprit is listingsService, which has a dependency on context
      const privateIds = privateResumes.map(({tokenId}) => tokenId)
      const allResumes = await listingsService.queryPublicResumes()
      const filteredResumes = allResumes.filter(entry => !privateIds.includes(entry.tokenId))

      console.log({allResumes, privateResumes, filteredResumes})

      setPrivateListings(privateResumes)
      setPublicListings(filteredResumes)
    }

    run()
  }, [])
```

Idea from https://stackoverflow.com/questions/61969259/can-i-ignore-exhaustive-deps-warning-for-usecontext
