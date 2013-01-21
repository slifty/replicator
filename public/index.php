<html>
<head>
		<title>The Collector</title>
		<link rel="stylesheet" href="css/main.css"></style>
		<script src="js/lib/jquery-1.9.0.min.js"></script>
		<script src="js/replicator.js"></script>
		<script>
			$(function() {
				$("#replicateButton").click(function() {
					$("#results").replicator($("#document").val());
				});
			});
		</script>
	</head>

	<body>
		<div id="content">
			<h1>The Replicator</h1>
			<p>When you think of a document you probably think of a book, a file, or a page that you could print out.  It stands alone, it is licensed as a unit, and it is easy to take down, censor, or destroy.  This makes a document pretty weak.</p>
			<p>What if the document wasn't defined by one person, one file, or one website?  What if it was defined by a group of people spread across the world, controlled by a collective?</p>
			<p>This page provides the recipe to transform text into a collective document.  More specifically, it takes text and breaks it into specially crafted tweets.  As those tweets are shared, the document transforms into something new.</p>
			<p>It becomes a collective document: replicated and distributed by the people, for the people.  The more widley it is shared, the safer it becomes.</p>
			<p>You can render collective documents anywhere on the open web using <a href="">this code</a>.  If you don't feel like setting it up yourself you can just visit <a href="">The Collector</a>.</p>
			<hr />
			<form>
				<ul>
					<li>
						<label for="document">Your Document's Text</label>
						<textarea id="document"></textarea>
					</li>
				</ul>
				<div id="results">
					<div id="replicateButton">Process Document</div>
				</div>
			</form>
		</div>
	</body>
</html>