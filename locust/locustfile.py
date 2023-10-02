from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(1, 2)

    # def on_start(self):
    #     self.client.post("/login", json={"username":"foo", "password":"bar"})

    @task
    def status_check(self):
        self.client.get("/status")

    @task
    def status_ping(self):
        self.client.get("/ping")